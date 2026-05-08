import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, FileText, DollarSign } from "lucide-react";

const mockProposalsData = [
  { month: "Jan", total: 45, approved: 32, rejected: 13 },
  { month: "Feb", total: 52, approved: 38, rejected: 14 },
  { month: "Mar", total: 48, approved: 35, rejected: 13 },
  { month: "Apr", total: 61, approved: 45, rejected: 16 },
  { month: "May", total: 55, approved: 42, rejected: 13 },
  { month: "Jun", total: 67, approved: 52, rejected: 15 },
];

const mockConversionData = [
  { name: "Aprovadas", value: 65, fill: "#dc2626" },
  { name: "Rejeitadas", value: 25, fill: "#e5e7eb" },
  { name: "Pendentes", value: 10, fill: "#9ca3af" },
];

const mockBankData = [
  { name: "Banco A", proposals: 25, conversion: 78 },
  { name: "Banco B", proposals: 18, conversion: 72 },
  { name: "Banco C", proposals: 22, conversion: 81 },
  { name: "Banco D", proposals: 15, conversion: 68 },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo, {user?.name}! Aqui está um resumo de suas operações.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Propostas</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">328</div>
            <p className="text-xs text-gray-600 mt-1">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76.2%</div>
            <p className="text-xs text-gray-600 mt-1">+3.2% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-gray-600 mt-1">+28 novos clientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Financeiro</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 8.2M</div>
            <p className="text-xs text-gray-600 mt-1">+18% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Proposals Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Propostas por Mês</CardTitle>
            <CardDescription>Tendência de propostas criadas, aprovadas e rejeitadas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockProposalsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#000" strokeWidth={2} />
                <Line type="monotone" dataKey="approved" stroke="#dc2626" strokeWidth={2} />
                <Line type="monotone" dataKey="rejected" stroke="#9ca3af" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão</CardTitle>
            <CardDescription>Distribuição de status das propostas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockConversionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockConversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bank Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Banco</CardTitle>
          <CardDescription>Número de propostas e taxa de conversão por banco parceiro</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockBankData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="proposals" fill="#000" />
              <Bar dataKey="conversion" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas ações no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">Proposta PROP-001{i} movida para Aprovado</p>
                  <p className="text-sm text-gray-600">por João Silva • 2 horas atrás</p>
                </div>
                <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">Proposta</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
