from pathlib import Path

main = Path('client/src/main.tsx')
s = main.read_text()
s = s.replace('url: "/api/trpc",', 'url: `${(import.meta.env.VITE_API_URL || "").replace(/\\/$/, "")}/api/trpc`,')
main.write_text(s)

const = Path('client/src/const.ts')
s = const.read_text()
s = s.replace('const redirectUri = `${window.location.origin}/api/oauth/callback`;', 'const apiOrigin = (import.meta.env.VITE_API_URL || window.location.origin).replace(/\\/$/, "");\n  const redirectUri = `${apiOrigin}/api/oauth/callback`;')
const.write_text(s)

server = Path('server/_core/index.ts')
s = server.read_text()
needle = '  const server = createServer(app);\n'
insert = '''  const server = createServer(app);\n  // Allow the separately deployed Vercel frontend to call the Render API.\n  const allowedOrigin = process.env.FRONTEND_URL;\n  app.use((req, res, next) => {\n    const origin = req.headers.origin;\n    if (origin && (!allowedOrigin || origin === allowedOrigin)) {\n      res.setHeader("Access-Control-Allow-Origin", origin);\n      res.setHeader("Vary", "Origin");\n      res.setHeader("Access-Control-Allow-Credentials", "true");\n      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");\n      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");\n    }\n    if (req.method === "OPTIONS") return res.sendStatus(204);\n    next();\n  });\n'''
if needle not in s:
    raise SystemExit('server insertion point not found')
s = s.replace(needle, insert, 1)
server.write_text(s)
