import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, ChevronRight, Mail, Phone } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();
  const { data: clients, isLoading } = trpc.clients.list.useQuery({ limit: 50 });

  const filteredClients = clients?.filter((client) =>
    client.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "prospect":
        return "bg-blue-100 text-blue-800";
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
      case "prospect":
        return "Prospect";
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerenciar e visualizar todos os clientes cadastrados
          </p>
        </div>
        <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 h-10 sm:h-9">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-border/50">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <Button
              variant="outline"
              className="gap-2 h-10"
              size="sm"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto" />
            <p className="text-sm text-muted-foreground">Carregando clientes...</p>
          </div>
        </div>
      ) : filteredClients.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Nenhum cliente encontrado</p>
              <p className="text-xs text-muted-foreground">Tente ajustar sua busca ou criar um novo cliente</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card className="border-border/50 overflow-hidden">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Lista de Clientes</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Total de {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="text-left py-3 px-4 font-semibold text-xs">Nome</th>
                        <th className="text-left py-3 px-4 font-semibold text-xs">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-xs">Telefone</th>
                        <th className="text-left py-3 px-4 font-semibold text-xs">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-xs">Score</th>
                        <th className="text-center py-3 px-4 font-semibold text-xs">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client) => (
                        <tr
                          key={client.id}
                          className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-sm">{client.fullName}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{client.email || "-"}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{client.phone || "-"}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(client.status)}`}>
                              {getStatusLabel(client.status)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">{client.creditScore || "-"}</td>
                          <td className="py-3 px-4 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setLocation(`/clients/${client.id}`)}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredClients.map((client) => (
              <Card
                key={client.id}
                className="border-border/50 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setLocation(`/clients/${client.id}`)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header with Name and Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{client.fullName}</h3>
                        <p className="text-xs text-muted-foreground truncate">{client.cpfCnpj || "CPF/CNPJ"}</p>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${getStatusColor(client.status)}`}>
                        {getStatusLabel(client.status)}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-xs">
                      {client.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{client.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Score and Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="text-xs">
                        <p className="text-muted-foreground">Score de Crédito</p>
                        <p className="font-semibold">{client.creditScore || "N/A"}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
