import { spawn } from 'node:child_process'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const children = [
  spawn(npm, ['run', 'client'], { stdio: 'inherit', shell: true }),
  spawn(npm, ['run', 'server'], { stdio: 'inherit', shell: true }),
]

const stop = () => children.forEach((child) => child.kill())
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
children.forEach((child) => child.on('exit', (code) => {
  if (code && code !== 0) process.exitCode = code
}))
