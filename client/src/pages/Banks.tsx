import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function BanksPage() {
  const { data: banks, isLoading } = trpc.banks.list.useQuery();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "maintenance":
        return "Manutenção";
      case "inactive":
        return "Inativo";
      default:
        return status;
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Bancos Parceiros</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerencie bancos e suas integrações
          </p>
        </div>
        <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 h-10 sm:h-9">
          <Plus className="w-4 h-4 mr-2" />
          Novo Banco
        </Button>
      </div>

      {/* Banks Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto" />
            <p className="text-sm text-muted-foreground">Carregando bancos...</p>
          </div>
        </div>
      ) : !banks || banks.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <Building2 className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-medium text-muted-foreground">Nenhum banco encontrado</p>
              <p className="text-xs text-muted-foreground">Crie um novo banco para começar</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {banks.map((bank) => (
            <Card
              key={bank.id}
              className="border-border/50 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">{bank.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm truncate">
                        {bank.code || "Código"}
                      </CardDescription>
                    </div>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0 ${getStatusColor(
                      bank.status
                    )}`}
                  >
                    {getStatusLabel(bank.status)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Integration Type */}
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Tipo de Integração</p>
                  <p className="text-sm font-semibold mt-1">{bank.integrationType || "API"}</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">SLA</p>
                    <p className="text-lg sm:text-xl font-bold mt-1">{bank.slaHours || 24}h</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Taxa de Aprovação</p>
                    <p className="text-lg sm:text-xl font-bold mt-1">{bank.approvalRate || 0}%</p>
                  </div>
                </div>

                {/* Additional Info */}
                {bank.slaHours && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Tempo de Resposta</p>
                    <p className="text-sm font-semibold mt-1">{bank.slaHours} horas</p>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  variant="outline"
                  className="w-full h-10 sm:h-9 text-sm gap-2"
                >
                  Ver Detalhes
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
