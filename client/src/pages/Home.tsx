import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { ArrowRight, BarChart3, Lock, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">CRM Bancário</div>
          <Button asChild>
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Gestão de Propostas Financeiras Simplificada
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Centralize clientes, propostas e bancos parceiros em uma única plataforma. 
            Automatize processos, aumente conversões e melhore a eficiência operacional.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <a href={getLoginUrl()}>
                Começar Agora <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline">
              Saber Mais
            </Button>
          </div>
        </div>

        <div className="bg-red-600 h-96 rounded-lg" />
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-24 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">Funcionalidades Principais</h2>
          
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white p-8 border-l-4 border-red-600">
              <BarChart3 className="w-8 h-8 mb-4 text-red-600" />
              <h3 className="text-xl font-bold mb-3">Dashboard em Tempo Real</h3>
              <p className="text-gray-600">
                Visualize KPIs, gráficos de desempenho e atividades recentes em um único lugar.
              </p>
            </div>

            <div className="bg-white p-8 border-l-4 border-red-600">
              <Users className="w-8 h-8 mb-4 text-red-600" />
              <h3 className="text-xl font-bold mb-3">Gestão de Clientes</h3>
              <p className="text-gray-600">
                Cadastro completo, timeline de interações, documentos e filtros avançados.
              </p>
            </div>

            <div className="bg-white p-8 border-l-4 border-red-600">
              <Zap className="w-8 h-8 mb-4 text-red-600" />
              <h3 className="text-xl font-bold mb-3">Automação de Workflows</h3>
              <p className="text-gray-600">
                Regras de transição, notificações automáticas e escalação inteligente.
              </p>
            </div>

            <div className="bg-white p-8 border-l-4 border-red-600">
              <Lock className="w-8 h-8 mb-4 text-red-600" />
              <h3 className="text-xl font-bold mb-3">Assinatura Digital</h3>
              <p className="text-gray-600">
                Links de autorização com token único, expiração configurável e rastreamento.
              </p>
            </div>

            <div className="bg-white p-8 border-l-4 border-red-600">
              <BarChart3 className="w-8 h-8 mb-4 text-red-600" />
              <h3 className="text-xl font-bold mb-3">Relatórios Gerenciais</h3>
              <p className="text-gray-600">
                Filtros avançados, exportação em PDF/XLSX e análise de conversão.
              </p>
            </div>

            <div className="bg-white p-8 border-l-4 border-red-600">
              <Lock className="w-8 h-8 mb-4 text-red-600" />
              <h3 className="text-xl font-bold mb-3">Controle de Acesso</h3>
              <p className="text-gray-600">
                4 níveis de permissão: Admin, Gerente, Consultor e Operador.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-black text-white p-16 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para transformar sua gestão?</h2>
          <p className="text-lg mb-8 text-gray-300">
            Comece agora e veja a diferença em sua operação.
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
            <a href={getLoginUrl()}>
              Acessar Plataforma <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 CRM Bancário. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
