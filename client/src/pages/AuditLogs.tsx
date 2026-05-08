import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: logs, isLoading } = trpc.auditLogs.list.useQuery({ limit: 100 });

  const filteredLogs = logs?.filter((log) =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entityType.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs de Auditoria</h1>
          <p className="text-gray-600 mt-2">Rastreamento completo de ações do sistema</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por ação ou entidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Ações</CardTitle>
          <CardDescription>Total de {filteredLogs.length} registros</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-600">Nenhum registro encontrado</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="text-left py-4 px-4 font-semibold">Usuário</th>
                    <th className="text-left py-4 px-4 font-semibold">Ação</th>
                    <th className="text-left py-4 px-4 font-semibold">Entidade</th>
                    <th className="text-left py-4 px-4 font-semibold">ID</th>
                    <th className="text-left py-4 px-4 font-semibold">Data/Hora</th>
                    <th className="text-left py-4 px-4 font-semibold">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">Usuário {log.userId}</td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{log.entityType}</td>
                      <td className="py-4 px-4 text-gray-600">{log.entityId || "-"}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(log.createdAt).toLocaleString("pt-BR")}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{log.ipAddress || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
