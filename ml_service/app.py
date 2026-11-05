"""MindLens inference service for the supplied RoBERTa + BiGRU checkpoint."""
from pathlib import Path
from typing import Any
import re

import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from torch import nn
from transformers import RobertaConfig, RobertaModel, RobertaTokenizerFast

ROOT = Path(__file__).parent
CHECKPOINT = ROOT / "saved_model" / "classifier_weights.pt"
TOKENIZER_DIR = ROOT / "saved_model" / "tokenizer"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class PredictionRequest(BaseModel):
    text: str


class ContextAwareClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        # These values are determined from classifier_weights.pt:
        # 6 encoder layers, hidden size 768, intermediate size 3072,
        # 12 attention heads, bidirectional GRU hidden size 128.
        config = RobertaConfig(
            vocab_size=50265,
            hidden_size=768,
            num_hidden_layers=6,
            num_attention_heads=12,
            intermediate_size=3072,
            max_position_embeddings=514,
            type_vocab_size=1,
            hidden_act="gelu",
            layer_norm_eps=1e-5,
            pad_token_id=1,
        )
        self.encoder = RobertaModel(config, add_pooling_layer=True)
        self.bigru = nn.GRU(768, 128, batch_first=True, bidirectional=True)
        self.attention = nn.Sequential(nn.Linear(256, 128), nn.Tanh(), nn.Linear(128, 1))
        self.classifier = nn.Linear(256, 2)

    def forward(self, input_ids, attention_mask):
        encoded = self.encoder(input_ids=input_ids, attention_mask=attention_mask).last_hidden_state
        return self.forward_sequence(encoded, attention_mask)

    def forward_embeds(self, inputs_embeds, attention_mask):
        encoded = self.encoder(inputs_embeds=inputs_embeds, attention_mask=attention_mask).last_hidden_state
        return self.forward_sequence(encoded, attention_mask)

    def forward_sequence(self, encoded, attention_mask):
        sequence, _ = self.bigru(encoded)
        scores = self.attention(sequence).squeeze(-1)
        scores = scores.masked_fill(attention_mask == 0, torch.finfo(scores.dtype).min)
        weights = torch.softmax(scores, dim=1).unsqueeze(-1)
        context = (sequence * weights).sum(dim=1)
        return self.classifier(context)


app = FastAPI(title="MindLens AI ML Service")
model: ContextAwareClassifier | None = None
tokenizer: RobertaTokenizerFast | None = None
model_error: str | None = None


@app.on_event("startup")
def load_model():
    global model, tokenizer, model_error
    try:
        if not CHECKPOINT.exists():
            raise FileNotFoundError(f"Missing checkpoint: {CHECKPOINT}")
        if not TOKENIZER_DIR.exists():
            raise FileNotFoundError(f"Missing tokenizer directory: {TOKENIZER_DIR}")
        tokenizer = RobertaTokenizerFast.from_pretrained(str(TOKENIZER_DIR))
        model = ContextAwareClassifier()
        state_dict = torch.load(CHECKPOINT, map_location=DEVICE, weights_only=True)
        model.load_state_dict(state_dict, strict=True)
        model.to(DEVICE)
        model.eval()
    except Exception as exc:  # surfaced through /health, never hidden as a fake result
        model = None
        tokenizer = None
        model_error = str(exc)


@app.get("/health")
def health():
    return {
        "ok": model is not None,
        "device": str(DEVICE),
        "modelArtifactsPresent": CHECKPOINT.exists() and TOKENIZER_DIR.exists(),
        "modelLoaded": model is not None,
        "error": model_error,
    }


@app.post("/predict")
def predict(request: PredictionRequest) -> dict[str, Any]:
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is required.")
    if len(text) > 500:
        raise HTTPException(status_code=400, detail="Text must be 500 characters or fewer.")
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail=f"Model could not be loaded: {model_error}")

    try:
        encoded = tokenizer(
            text,
            return_tensors="pt",
            return_offsets_mapping=True,
            truncation=True,
            max_length=512,
        )
        encoded = {key: value.to(DEVICE) for key, value in encoded.items()}
        with torch.inference_mode():
            logits = model(encoded["input_ids"], encoded["attention_mask"])
            probabilities = torch.softmax(logits, dim=-1)[0]
        label = int(torch.argmax(probabilities).item())
        confidence = float(probabilities[label].item() * 100)
        risk_score = float(probabilities[1].item() * 100)
        token_scores, convergence_delta = integrated_gradients(encoded, label)
        attributions = word_attributions_from_offsets(
            text, encoded["offset_mapping"][0], token_scores
        )
        return {
            "inputText": text,
            "predictedClass": "Suicidal" if label == 1 else "Non-Suicidal",
            "label": label,
            "riskScore": round(risk_score, 2),
            "confidence": round(confidence, 2),
            "igConvergenceDelta": convergence_delta,
            "contextualRiskPhrases": attribution_phrases(attributions, text),
            "topTriggerWords": top_attribution_words(attributions),
            "attributions": attributions,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Inference failed: {exc}") from exc


def integrated_gradients(encoded: dict[str, torch.Tensor], target: int):
    """Compute Integrated Gradients for evidence supporting the selected class."""
    input_ids = encoded["input_ids"]
    mask = encoded["attention_mask"]
    with torch.no_grad():
        # forward_embeds applies RoBERTa's positional embeddings and layer norm.
        # Therefore these must be raw word embeddings, not encoder.embeddings(...),
        # which would otherwise apply those operations twice.
        input_embeddings = model.encoder.get_input_embeddings()(input_ids)
        baseline_ids = torch.full_like(input_ids, tokenizer.pad_token_id or 1)
        baseline_embeddings = model.encoder.get_input_embeddings()(baseline_ids)
        input_logit = model.forward_embeds(input_embeddings, mask)[0, target].item()
        baseline_logit = model.forward_embeds(baseline_embeddings, mask)[0, target].item()

    difference = input_embeddings - baseline_embeddings
    total_gradients = torch.zeros_like(input_embeddings)
    # More integration steps improve faithfulness while remaining fast for the
    # short captions accepted by this API.
    for step in range(1, 33):
        scaled = (baseline_embeddings + difference * (step / 32)).detach().requires_grad_(True)
        score = model.forward_embeds(scaled, mask)[0, target]
        total_gradients += torch.autograd.grad(score, scaled)[0].detach()
    token_scores = (difference * (total_gradients / 32)).sum(dim=-1)[0]
    delta = abs(float(token_scores.sum().item()) - (input_logit - baseline_logit))
    return token_scores.detach().cpu().tolist(), round(delta, 6)


def word_attributions_from_offsets(
    text: str, offset_mapping: torch.Tensor, token_scores: list[float]
) -> list[dict[str, Any]]:
    """Merge RoBERTa subword scores into the original, readable words."""
    words = [
        {"token": match.group(), "score": 0.0, "start": match.start(), "end": match.end()}
        for match in re.finditer(r"[^\W_]+(?:['’][^\W_]+)*", text, flags=re.UNICODE)
    ]
    for (start, end), score in zip(offset_mapping.detach().cpu().tolist(), token_scores):
        if start == end:  # RoBERTa special tokens have empty offsets.
            continue
        for word in words:
            if start < word["end"] and end > word["start"]:
                word["score"] += float(score)
                break
    return [
        {"token": word["token"], "score": round(word["score"], 6)}
        for word in words
    ]


def top_attribution_words(attributions: list[dict[str, Any]]) -> list[str]:
    """Return the strongest positive words supporting the predicted class."""
    ranked = sorted(attributions, key=lambda item: float(item["score"]), reverse=True)
    return [item["token"] for item in ranked if float(item["score"]) > 0][:5]


def attribution_phrases(attributions: list[dict[str, Any]], text: str) -> list[str]:
    """Create short, readable context windows around strong supporting words."""
    positive = [float(item["score"]) for item in attributions if float(item["score"]) > 0]
    if not positive:
        return []

    # Anchor only on the strongest 30% of positive word scores. The surrounding
    # window supplies readable sentence context without joining every weakly
    # positive token into a misleadingly long phrase.
    threshold = sorted(positive)[max(0, int(len(positive) * 0.7) - 1)]
    anchors = sorted(
        (
            index
            for index, item in enumerate(attributions)
            if float(item["score"]) >= threshold and float(item["score"]) > 0
        ),
        key=lambda index: float(attributions[index]["score"]),
        reverse=True,
    )
    word_spans = list(re.finditer(r"[^\W_]+(?:['’][^\W_]+)*", text, flags=re.UNICODE))
    phrases: list[str] = []
    selected_ranges: list[tuple[int, int]] = []
    for index in anchors:
        sentence_start = index
        sentence_end = index
        while sentence_start > 0:
            if re.search(r"[.!?]", text[word_spans[sentence_start - 1].end():word_spans[sentence_start].start()]):
                break
            sentence_start -= 1
        while sentence_end < len(word_spans) - 1:
            if re.search(r"[.!?]", text[word_spans[sentence_end].end():word_spans[sentence_end + 1].start()]):
                break
            sentence_end += 1

        # Return a whole short sentence; otherwise use a compact five-word
        # context window around the strongest supporting word.
        if sentence_end - sentence_start < 8:
            start, end = sentence_start, sentence_end
        else:
            start = max(sentence_start, index - 2)
            end = min(sentence_end, index + 2)
        if any(start <= used_end and end >= used_start for used_start, used_end in selected_ranges):
            continue
        phrase = text[word_spans[start].start():word_spans[end].end()].strip()
        if phrase and phrase not in phrases:
            phrases.append(phrase)
            selected_ranges.append((start, end))
        if len(phrases) == 3:
            break
    return phrases
