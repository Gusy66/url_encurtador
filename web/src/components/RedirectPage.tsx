import { useEffect } from 'react'
import { Link as LinkIcon } from "lucide-react";

interface RedirectPageProps {
  shortCode: string
}

export function RedirectPage({ shortCode }: RedirectPageProps) {
  useEffect(() => {
    // Simular redirecionamento após 3 segundos
    const timer = setTimeout(() => {
      // Aqui você faria a requisição para obter a URL original
      // e redirecionar o usuário
      console.log('Redirecionando para:', shortCode)
    }, 3000)

    return () => clearTimeout(timer)
  }, [shortCode])

  return (
    <div className="min-h-dvh bg-page flex items-center justify-center px-4">
      <div className="bg-card rounded-lg border border-border shadow-card p-12 max-w-md w-full text-center">
        <div className="logo mb-6">
          <div className="inline-flex items-center gap-2 text-primary font-semibold">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <LinkIcon className="h-5 w-5 text-primary" />
            </div>
            brev.ly
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold text-ink mb-4">
          Redirecionando...
        </h1>
        
        <p className="text-muted mb-2 text-sm">
          O link será aberto automaticamente em alguns instantes.
        </p>
        
        <p className="text-muted text-sm">
          Não foi redirecionado? <a href="#" className="text-primary hover:underline">Acesse aqui</a>
        </p>
      </div>
    </div>
  )
}
