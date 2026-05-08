import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function BanksPage() {
  const { data: banks, isLoading } = trpc.banks.list.useQuery();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bancos Parceiros</h1>
          <p className="text-gray-600 mt-2">Gerencie bancos e suas integrações</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Banco
        </Button>
      </div>

      {/* Banks Grid */}
      {isLoading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {banks?.map((bank) => (
            <Card key={bank.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-red-600" />
                      {bank.name}
                    </CardTitle>
                    <CardDescription>{bank.code}</CardDescription>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    bank.status === "active" ? "bg-green-100 text-green-700" :
                    bank.status === "maintenance" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {bank.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Tipo de Integração</p>
                  <p className="font-medium">{bank.integrationType}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">SLA</p>
                    <p className="font-medium">{bank.slaHours}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Aprovação</p>
                    <p className="font-medium">{bank.approvalRate}%</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Ver Detalhes</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
