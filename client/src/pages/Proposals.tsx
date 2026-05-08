import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Filter, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

const PROPOSAL_STATUSES = [
  { id: "draft", label: "Rascunho", color: "bg-gray-100 text-gray-900", textColor: "text-gray-900" },
  { id: "analysis", label: "Em Análise", color: "bg-blue-100 text-blue-900", textColor: "text-blue-900" },
  { id: "approved", label: "Aprovado", color: "bg-green-100 text-green-900", textColor: "text-green-900" },
  { id: "rejected", label: "Reprovado", color: "bg-red-100 text-red-900", textColor: "text-red-900" },
  { id: "contracted", label: "Contratado", color: "bg-purple-100 text-purple-900", textColor: "text-purple-900" },
];

export default function ProposalsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { data: proposals, isLoading } = trpc.proposals.list.useQuery({ limit: 100 });

  const groupedProposals = PROPOSAL_STATUSES.reduce(
    (acc, status) => {
      acc[status.id] = proposals?.filter((p) => p.status === status.id) || [];
      return acc;
    },
    {} as Record<string, any[]>
  );

  const totalProposals = Object.values(groupedProposals).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Propostas</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerencie propostas financeiras com Kanban
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="gap-2 flex-1 sm:flex-none h-10 sm:h-9"
            size="sm"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
          <Button className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 h-10 sm:h-9">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Nova Proposta</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
        {PROPOSAL_STATUSES.map((status) => (
          <Card key={status.id} className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs text-muted-foreground truncate">{status.label}</p>
              <p className="text-lg sm:text-2xl font-bold mt-1">
                {groupedProposals[status.id]?.length || 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto" />
            <p className="text-sm text-muted-foreground">Carregando propostas...</p>
          </div>
        </div>
      ) : totalProposals === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Nenhuma proposta encontrada</p>
              <p className="text-xs text-muted-foreground">Crie uma nova proposta para começar</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Kanban View */}
          <div className="hidden md:block overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-full">
              {PROPOSAL_STATUSES.map((status) => (
                <div key={status.id} className="flex-shrink-0 w-80">
                  {/* Column Header */}
                  <div className={`${status.color} rounded-lg p-4 mb-4 border border-black/10`}>
                    <h3 className="font-semibold text-sm">{status.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {groupedProposals[status.id]?.length || 0} proposta{groupedProposals[status.id]?.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3 min-h-96">
                    {(groupedProposals[status.id] || []).map((proposal) => (
                      <Card
                        key={proposal.id}
                        className="cursor-move hover:shadow-md transition-shadow border-border/50"
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <p className="font-semibold text-sm truncate">{proposal.number}</p>
                            <p className="text-xs text-muted-foreground">
                              Cliente: {proposal.clientId}
                            </p>
                            <p className="text-sm font-bold text-red-600">
                              R$ {(Number(proposal.amount) / 100).toLocaleString("pt-BR")}
                            </p>
                            <div className="flex gap-2 pt-2 border-t border-border/50">
                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                Banco {proposal.bankId}
                              </span>
                              {proposal.interestRate && (
                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                  {proposal.interestRate}%
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile List View */}
          <div className="md:hidden space-y-4">
            {/* Status Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedStatus(null)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedStatus === null
                    ? "bg-red-600 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Todas ({totalProposals})
              </button>
              {PROPOSAL_STATUSES.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setSelectedStatus(status.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedStatus === status.id
                      ? "bg-red-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {status.label} ({groupedProposals[status.id]?.length || 0})
                </button>
              ))}
            </div>

            {/* Proposals List */}
            <div className="space-y-3">
              {PROPOSAL_STATUSES.map((status) => {
                if (selectedStatus && selectedStatus !== status.id) return null;

                const statusProposals = groupedProposals[status.id] || [];
                if (statusProposals.length === 0 && selectedStatus === status.id) {
                  return (
                    <div key={status.id} className="text-center py-8">
                      <p className="text-sm text-muted-foreground">Nenhuma proposta neste status</p>
                    </div>
                  );
                }

                return (
                  <div key={status.id}>
                    {selectedStatus === null && (
                      <div className={`${status.color} rounded-lg p-3 mb-2 border border-black/10`}>
                        <h3 className="font-semibold text-sm">{status.label}</h3>
                        <p className="text-xs text-muted-foreground">
                          {statusProposals.length} proposta{statusProposals.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {statusProposals.map((proposal) => (
                        <Card
                          key={proposal.id}
                          className="border-border/50 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{proposal.number}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Cliente: {proposal.clientId}
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                            </div>

                            <div className="mt-3 space-y-2">
                              <p className="text-sm font-bold text-red-600">
                                R$ {(Number(proposal.amount) / 100).toLocaleString("pt-BR")}
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                <span className={`text-xs px-2 py-1 rounded font-medium ${status.color}`}>
                                  {status.label}
                                </span>
                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                  Banco {proposal.bankId}
                                </span>
                                {proposal.interestRate && (
                                  <span className="text-xs bg-muted px-2 py-1 rounded">
                                    {proposal.interestRate}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
