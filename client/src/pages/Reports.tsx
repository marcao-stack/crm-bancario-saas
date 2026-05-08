import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-gray-600 mt-2">Análise de desempenho e métricas operacionais</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar Dados
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Período</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
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

            <div>
              <label className="text-sm font-medium">Banco</label>
              <Select value={bank} onValueChange={setBank}>
                <SelectTrigger>
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

            <div>
              <label className="text-sm font-medium">Consultor</label>
              <Select value={consultant} onValueChange={setConsultant}>
                <SelectTrigger>
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
      <Card>
        <CardHeader>
          <CardTitle>Receita e Propostas</CardTitle>
          <CardDescription>Tendência de receita e volume de propostas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2} />
              <Line type="monotone" dataKey="proposals" stroke="#000" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Consultant Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance de Consultores</CardTitle>
          <CardDescription>Ranking de consultores por conversão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="text-left py-4 px-4 font-semibold">Consultor</th>
                  <th className="text-left py-4 px-4 font-semibold">Propostas</th>
                  <th className="text-left py-4 px-4 font-semibold">Aprovadas</th>
                  <th className="text-left py-4 px-4 font-semibold">Taxa de Conversão</th>
                </tr>
              </thead>
              <tbody>
                {consultantPerformance.map((consultant, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{consultant.name}</td>
                    <td className="py-4 px-4">{consultant.proposals}</td>
                    <td className="py-4 px-4">{consultant.approved}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-red-600">{consultant.conversion}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bank Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Banco</CardTitle>
          <CardDescription>Análise de conversão e tempo médio de aprovação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="text-left py-4 px-4 font-semibold">Banco</th>
                  <th className="text-left py-4 px-4 font-semibold">Propostas</th>
                  <th className="text-left py-4 px-4 font-semibold">Aprovadas</th>
                  <th className="text-left py-4 px-4 font-semibold">Taxa de Conversão</th>
                  <th className="text-left py-4 px-4 font-semibold">Tempo Médio</th>
                </tr>
              </thead>
              <tbody>
                {bankPerformance.map((bank, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{bank.bank}</td>
                    <td className="py-4 px-4">{bank.proposals}</td>
                    <td className="py-4 px-4">{bank.approved}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-red-600">{bank.conversion}</span>
                    </td>
                    <td className="py-4 px-4">{bank.avgTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Exportar Relatório</CardTitle>
          <CardDescription>Escolha o formato de exportação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Excel
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
