import { Link as LinkIcon } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-dvh bg-page flex items-center justify-center p-8">
      <div className="bg-card rounded-lg border border-border shadow-card p-12 max-w-md w-full text-center">
        <div className="logo mb-6">
          <div className="inline-flex items-center gap-2 text-primary font-semibold">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <LinkIcon className="h-5 w-5 text-primary" />
            </div>
            brev.ly
          </div>
        </div>
        
        <div className="text-6xl font-bold text-ink mb-4 relative">
          404
        </div>
        
        <h2 className="text-2xl font-semibold text-ink mb-4">
          Link não encontrado
        </h2>
        
        <p className="text-muted text-sm leading-relaxed">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em{' '}
          <a href="/" className="text-primary hover:underline">brev.ly</a>.
        </p>
      </div>
    </div>
  )
}
