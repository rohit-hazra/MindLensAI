import { useEffect, useState } from "react";
import "./App.css";
import { Layout } from "./components/Site";
import Home from "./pages/Home";
import Research from "./pages/Research";

const routes = { "/": Home, "/research": Research };

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  const Page = routes[path] || Home;
  return <Layout path={path}><Page /></Layout>;
}
