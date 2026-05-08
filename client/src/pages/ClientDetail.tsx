import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, MessageSquare, Edit2, Trash2, Download } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function ClientDetail() {
  const [, params] = useLocation();
  const clientId = parseInt((params as any)?.id || "0");
  const [activeTab, setActiveTab] = useState("overview");

  const { data: client, isLoading } = trpc.clients.getById.useQuery({ id: clientId });

  if (isLoading) return <div className="text-center py-12">Carregando...</div>;
  if (!client) return <div className="text-center py-12">Cliente não encontrado</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.fullName}</h1>
          <p className="text-gray-600 mt-2">{client.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit2 className="w-4 h-4" />
            Editar
          </Button>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="w-4 h-4" />
            Deletar
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            client.status === "active" ? "bg-green-100 text-green-700" :
            client.status === "prospect" ? "bg-blue-100 text-blue-700" :
            "bg-gray-100 text-gray-700"
          }`}>
            {client.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Score de Crédito:</span>
          <span className="font-semibold">{client.creditScore || "-"}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="proposals">Propostas</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{client.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium">{client.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CPF/CNPJ</p>
                  <p className="font-medium">{client.cpfCnpj || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data de Cadastro</p>
                  <p className="font-medium">
                    {client.createdAt ? new Date(client.createdAt).toLocaleDateString("pt-BR") : "-"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Financeiras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Renda Mensal</p>
                  <p className="font-medium text-lg">
                    {client.monthlyIncome ? `R$ ${(Number(client.monthlyIncome) / 100).toLocaleString("pt-BR")}` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Score de Crédito</p>
                  <p className="font-medium text-lg">{client.creditScore || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Marital Status</p>
                  <p className="font-medium">{client.maritalStatus || "-"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Interações</CardTitle>
              <CardDescription>Todas as ações relacionadas a este cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">Proposta PROP-001{i} criada</p>
                      <p className="text-sm text-gray-600">por João Silva</p>
                      <p className="text-xs text-gray-400 mt-1">2 dias atrás</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-end">
            <Button className="bg-red-600 hover:bg-red-700 gap-2">
              <Plus className="w-4 h-4" />
              Upload Documento
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>Arquivos do cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "RG.pdf", size: "2.4 MB", date: "2026-05-01" },
                  { name: "Comprovante_Renda.pdf", size: "1.8 MB", date: "2026-05-02" },
                  { name: "Extrato_Bancario.pdf", size: "3.2 MB", date: "2026-05-03" },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-600">{doc.size} • {doc.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Proposals Tab */}
        <TabsContent value="proposals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Propostas do Cliente</CardTitle>
              <CardDescription>Todas as propostas associadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/10">
                      <th className="text-left py-3 px-4 font-semibold">Número</th>
                      <th className="text-left py-3 px-4 font-semibold">Banco</th>
                      <th className="text-left py-3 px-4 font-semibold">Valor</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">PROP-{String(i).padStart(6, "0")}</td>
                        <td className="py-3 px-4">Banco A</td>
                        <td className="py-3 px-4 font-semibold">R$ {(10000 * i).toLocaleString("pt-BR")}</td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                            Aprovado
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">2026-05-0{i}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
