import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link as LinkIcon, Copy, Trash2, Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "./components/ui/Card";
import { Input } from "./components/ui/Input";
import { Button } from "./components/ui/Button";

type UrlItem = {
  shortUrl: string;     // ex.: http://127.0.0.1:3333/r/ABC123
  originalUrl: string;  // ex.: https://linkedin.com/in/...
  shortCode: string;    // ABC123
  clicks?: number;      // opcional para exibir “X acessos”
};

export default function App() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState(""); // "brev.ly/<alias>"
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<UrlItem[]>([]);

  useEffect(() => {
    // Carrega a listagem inicial do backend (persistência após refresh)
    (async () => {
      try {
        const res = await fetch("/api/urls");
        if (!res.ok) return;
        const payload = await res.json(); // { success: true, data: UrlItem[] }
        const list = Array.isArray(payload?.data) ? payload.data : [];
        setItems(list);
      } catch {
        // silencioso: UI continua utilizável mesmo sem lista inicial
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const body: Record<string, unknown> = { url };
      if (alias.trim()) body.desiredCode = alias.trim(); // se backend aceitar

      const res = await fetch("/api/urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Falha ao encurtar a URL");
      const payload = await res.json(); // { success: true, data: { shortUrl, originalUrl, shortCode } }
      const data = payload?.data ?? payload;

      setItems((prev) => [{ ...data, clicks: 0 }, ...prev]);
      setUrl("");
      setAlias("");
    } catch (err) {
      alert("Não foi possível encurtar a URL.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  function removeItem(code: string) {
    setItems((prev) => prev.filter((i) => i.shortCode !== code));
  }

  const csvHref = useMemo(() => {
    if (!items.length) return "";
    const header = ["shortUrl", "originalUrl", "shortCode", "clicks"];
    const rows = items.map((i) =>
      [i.shortUrl, i.originalUrl, i.shortCode, String(i.clicks ?? 0)]
        .map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")
    );
    const blob = new Blob([header.join(",") + "\n" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    return URL.createObjectURL(blob);
  }, [items]);

  return (
    <div className="min-h-dvh">
      {/* Barra superior com logo */}
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center gap-2">
          {/* logotipo simplificado */}
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <LinkIcon className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-semibold text-ink">brev.ly</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Coluna esquerda — Novo link */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-ink">Novo link</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <div>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Link original
                  </div>
                  <Input
                    placeholder="www.exemplo.com.br"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>

                <div>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Link encurtado
                  </div>
                  <div className="flex">
                    <span className="inline-flex select-none items-center rounded-l-lg border border-border bg-card px-3 text-[15px] text-muted">
                      brev.ly/
                    </span>
                    <Input
                      className="rounded-l-none"
                      placeholder=""
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" disabled={loading} className="w-full">
                  {loading ? "Salvando..." : "Salvar link"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Coluna direita — Meus links */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-ink">Meus links</h2>

              <a
                href={csvHref || undefined}
                download="links.csv"
                onClick={(e) => { if (!csvHref) e.preventDefault(); }}
              >
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Baixar CSV
                </Button>
              </a>
            </CardHeader>

            {/* divisor leve igual ao Figma */}
            <div className="mx-6 mb-4 border-t border-border" />

            <CardContent>
              {!items.length ? (
                <div className="flex w-full flex-col items-center justify-center py-14 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border">
                    <LinkIcon className="h-6 w-6 text-primary/60" />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Ainda não existem links cadastrados
                  </div>
                </div>
              ) : (
                <ul className="flex flex-col">
                  {items.map((it) => (
                    <li key={it.shortCode} className="border-t border-border first:border-t-0">
                      <div className="flex items-center gap-4 py-4">
                        <div className="flex-1">
                          <a
                            href={it.shortUrl}
                            target="_blank"
                            className="block font-medium text-primary hover:underline"
                          >
                            {toDisplayShort(it.shortUrl)}
                          </a>
                          <div className="mt-1 text-sm text-muted break-all">{it.originalUrl}</div>
                        </div>

                        <div className="hidden shrink-0 pr-1 text-sm text-muted sm:block">
                          {(it.clicks ?? 0)} acessos
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-9 w-9 p-0"
                            title="Copiar link curto"
                            onClick={() => copyToClipboard(it.shortUrl)}
                          >
                            <Copy className="h-4 w-4 text-ink" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-9 w-9 p-0"
                            title="Excluir da lista"
                            onClick={() => removeItem(it.shortCode)}
                          >
                            <Trash2 className="h-4 w-4 text-ink" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function toDisplayShort(shortUrl: string) {
  try {
    const u = new URL(shortUrl);
    // UX: exibe como "brev.ly/<codigo>" (marca), independente do host real
    if (u.pathname.startsWith("/r/")) {
      const code = u.pathname.replace(/^\/r\//, "");
      return `brev.ly/${code}`;
    }
    return `${u.host}${u.pathname}`;
  } catch {
    return shortUrl;
  }
}
