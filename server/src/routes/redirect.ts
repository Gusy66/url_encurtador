import { FastifyInstance } from "fastify";

export async function redirectRoutes(app: FastifyInstance) {
  app.get("/r/:code", async (req, reply) => {
    const { code } = req.params as { code: string };
    // ...buscar no banco, incrementar clique...
    const url = await app.db.url.findByCode(code); // pseudo

    if (!url) {
      reply
        .type("text/html")
        .code(404)
        .send(render404());
      return;
    }

    reply
      .type("text/html")
      .send(renderRedirect(url.original_url));
  });
}

function baseHead(title: string) {
  return `
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root{--page:#e9ecf3;--card:#fff;--ink:#1d2430;--muted:#6b7280;--pri:#2b3fd6;}
    html,body{height:100%}
    body{margin:0;background:var(--page);color:var(--ink);font-family:Inter,system-ui,Segoe UI,Roboto,sans-serif}
    .center{min-height:100%;display:grid;place-items:center;padding:24px}
    .card{background:var(--card);border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 10px 30px rgba(14,22,40,.08);max-width:720px;width:100%;padding:48px;text-align:center}
    .logo{display:inline-flex;align-items:center;gap:10px;margin-bottom:10px;color:var(--pri);font-weight:600}
    .muted{color:var(--muted)}
    a{color:var(--pri);text-decoration:none} a:hover{text-decoration:underline}
  </style>`;
}

function renderRedirect(target: string) {
  const esc = target.replace(/"/g, '&quot;');
  return `<!doctype html>
  <html><head>${baseHead("Redirecionando...")}
    <meta http-equiv="refresh" content="1;url=${esc}">
    <script>setTimeout(()=>{location.href="${esc}"}, 500);</script>
  </head>
  <body>
    <div class="center">
      <div class="card">
        <div class="logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 6"/><path d="M14 11a5 5 0 0 0-7.07 0L5.5 12.43a5 5 0 0 0 7.07 7.07L14 18"/></svg>
          brev.ly
        </div>
        <h1 style="font-size:28px;margin:4px 0 12px">Redirecionando…</h1>
        <p class="muted">O link será aberto automaticamente em alguns instantes.<br/>
        Não foi redirecionado? <a href="${esc}">Acesse aqui</a>.</p>
      </div>
    </div>
  </body></html>`;
}

function render404() {
  return `<!doctype html>
  <html><head>${baseHead("Link não encontrado")}</head>
  <body>
    <div class="center">
      <div class="card">
        <div class="logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 6"/><path d="M14 11a5 5 0 0 0-7.07 0L5.5 12.43a5 5 0 0 0 7.07 7.07L14 18"/></svg>
          brev.ly
        </div>
        <div style="font-size:74px;font-weight:800;letter-spacing:2px;color:#1d2430;opacity:.95;margin:6px 0 8px">404</div>
        <h2 style="font-size:26px;margin:0 0 10px">Link não encontrado</h2>
        <p class="muted">O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em <a href="/">brev.ly</a>.</p>
      </div>
    </div>
  </body></html>`;
}
