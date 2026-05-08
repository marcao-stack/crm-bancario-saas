import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Filter } from "lucide-react";
import { trpc } from "@/lib/trpc";

const PROPOSAL_STATUSES = [
  { id: "draft", label: "Rascunho", color: "bg-gray-100" },
  { id: "analysis", label: "Em Análise", color: "bg-blue-100" },
  { id: "approved", label: "Aprovado", color: "bg-green-100" },
  { id: "rejected", label: "Reprovado", color: "bg-red-100" },
  { id: "contracted", label: "Contratado", color: "bg-purple-100" },
];

export default function ProposalsPage() {
  const { data: proposals, isLoading } = trpc.proposals.list.useQuery({ limit: 100 });

  const groupedProposals = PROPOSAL_STATUSES.reduce((acc, status) => {
    acc[status.id] = proposals?.filter((p) => p.status === status.id) || [];
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propostas</h1>
          <p className="text-gray-600 mt-2">Gerencie propostas financeiras com Kanban</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Proposta
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
        <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
          {PROPOSAL_STATUSES.map((status) => (
            <div key={status.id} className="flex-shrink-0 w-80">
              <div className={`${status.color} rounded-lg p-4 mb-4`}>
                <h3 className="font-semibold text-sm">{status.label}</h3>
                <p className="text-xs text-gray-600">{groupedProposals[status.id]?.length || 0} propostas</p>
              </div>

              <div className="space-y-3">
                {(groupedProposals[status.id] || []).map((proposal) => (
                  <Card key={proposal.id} className="cursor-move hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <p className="font-medium text-sm">{proposal.proposalNumber}</p>
                      <p className="text-xs text-gray-600 mt-1">Cliente ID: {proposal.clientId}</p>
                      <p className="text-sm font-bold mt-2 text-red-600">
                        R$ {(Number(proposal.amount) / 100).toLocaleString("pt-BR")}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                          Banco {proposal.bankId}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
