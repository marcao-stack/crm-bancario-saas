import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const reportData = [
  { period: "Jan", revenue: 45000, proposals: 45, approved: 32 },
  { period: "Feb", revenue: 52000, proposals: 52, approved: 38 },
  { period: "Mar", revenue: 48000, proposals: 48, approved: 35 },
  { period: "Apr", revenue: 61000, proposals: 61, approved: 45 },
  { period: "May", revenue: 55000, proposals: 55, approved: 42 },
  { period: "Jun", revenue: 67000, proposals: 67, approved: 52 },
];

const consultantPerformance = [
  { name: "João Silva", proposals: 28, approved: 22, conversion: "78.6%" },
  { name: "Maria Santos", proposals: 25, approved: 19, conversion: "76.0%" },
  { name: "Carlos Oliveira", proposals: 22, approved: 18, conversion: "81.8%" },
  { name: "Ana Costa", proposals: 18, approved: 14, conversion: "77.8%" },
  { name: "Pedro Ferreira", proposals: 15, approved: 12, conversion: "80.0%" },
];

const bankPerformance = [
  { bank: "Banco A", proposals: 45, approved: 35, conversion: "77.8%", avgTime: "2.3 dias" },
  { bank: "Banco B", proposals: 38, approved: 29, conversion: "76.3%", avgTime: "2.8 dias" },
  { bank: "Banco C", proposals: 42, approved: 34, conversion: "81.0%", avgTime: "2.1 dias" },
  { bank: "Banco D", proposals: 32, approved: 22, conversion: "68.8%", avgTime: "3.5 dias" },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("month");
  const [bank, setBank] = useState("all");
  const [consultant, setConsultant] = useState("all");

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Análise de desempenho e métricas operacionais
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full sm:w-auto gap-2 h-10 sm:h-9"
          size="sm"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar Dados</span>
          <span className="sm:hidden">Exportar</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="pt-4 sm:pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Período</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="h-10 sm:h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mês</SelectItem>
                  <SelectItem value="quarter">Último Trimestre</SelectItem>
                  <SelectItem value="year">Último Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Banco</label>
              <Select value={bank} onValueChange={setBank}>
                <SelectTrigger className="h-10 sm:h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Bancos</SelectItem>
                  <SelectItem value="banco-a">Banco A</SelectItem>
                  <SelectItem value="banco-b">Banco B</SelectItem>
                  <SelectItem value="banco-c">Banco C</SelectItem>
                  <SelectItem value="banco-d">Banco D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Consultor</label>
              <Select value={consultant} onValueChange={setConsultant}>
                <SelectTrigger className="h-10 sm:h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Consultores</SelectItem>
                  <SelectItem value="joao">João Silva</SelectItem>
                  <SelectItem value="maria">Maria Santos</SelectItem>
                  <SelectItem value="carlos">Carlos Oliveira</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Receita e Propostas</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Tendência de receita e volume de propostas</CardDescription>
        </CardHeader>
        <CardContent className="pb-2 sm:pb-4">
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={reportData}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Receita (R$)"
                />
                <Line
                  type="monotone"
                  dataKey="proposals"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Propostas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Consultant Performance */}
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Performance de Consultores</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Ranking de consultores por conversão</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left py-3 px-4 font-semibold text-xs">Consultor</th>
                  <th className="text-center py-3 px-4 font-semibold text-xs">Propostas</th>
                  <th className="text-center py-3 px-4 font-semibold text-xs">Aprovadas</th>
                  <th className="text-center py-3 px-4 font-semibold text-xs">Conversão</th>
                </tr>
              </thead>
              <tbody>
                {consultantPerformance.map((consultant, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-sm">{consultant.name}</td>
                    <td className="py-3 px-4 text-center text-sm">{consultant.proposals}</td>
                    <td className="py-3 px-4 text-center text-sm font-semibold text-red-600">
                      {consultant.approved}
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-semibold">
                      {consultant.conversion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bank Performance */}
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Performance por Banco</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Análise de conversão e tempo médio de resposta</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left py-3 px-4 font-semibold text-xs">Banco</th>
                  <th className="text-center py-3 px-4 font-semibold text-xs">Propostas</th>
                  <th className="text-center py-3 px-4 font-semibold text-xs">Aprovadas</th>
                  <th className="text-center py-3 px-4 font-semibold text-xs">Conversão</th>
                  <th className="text-center py-3 px-4 font-semibold text-xs hidden sm:table-cell">Tempo Médio</th>
                </tr>
              </thead>
              <tbody>
                {bankPerformance.map((bank, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-sm">{bank.bank}</td>
                    <td className="py-3 px-4 text-center text-sm">{bank.proposals}</td>
                    <td className="py-3 px-4 text-center text-sm font-semibold text-red-600">
                      {bank.approved}
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-semibold">{bank.conversion}</td>
                    <td className="py-3 px-4 text-center text-sm hidden sm:table-cell text-muted-foreground">
                      {bank.avgTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
