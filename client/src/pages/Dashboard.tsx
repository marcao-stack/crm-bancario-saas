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
    <div className="w-full space-y-4 md:space-y-8 px-4 md:px-0">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600">Bem-vindo, {user?.name}! Aqui está um resumo de suas operações.</p>
      </div>

      {/* KPI Cards - Mobile First: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total de Propostas</CardTitle>
            <FileText className="h-4 w-4 text-red-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">328</div>
            <p className="text-xs text-gray-600 mt-1">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">76.2%</div>
            <p className="text-xs text-gray-600 mt-1">+3.2% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-red-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">1,245</div>
            <p className="text-xs text-gray-600 mt-1">+28 novos clientes</p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Volume Financeiro</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">R$ 8.2M</div>
            <p className="text-xs text-gray-600 mt-1">+18% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Mobile First: 1 col, Desktop: 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        {/* Proposals Over Time */}
        <Card className="min-w-0 overflow-x-auto">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Propostas por Mês</CardTitle>
            <CardDescription className="text-xs md:text-sm">Tendência de propostas criadas, aprovadas e rejeitadas</CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <ResponsiveContainer width="100%" height={250} minWidth={280}>
              <LineChart data={mockProposalsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#000" strokeWidth={2} />
                <Line type="monotone" dataKey="approved" stroke="#dc2626" strokeWidth={2} />
                <Line type="monotone" dataKey="rejected" stroke="#9ca3af" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Rate Pie Chart */}
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Taxa de Conversão</CardTitle>
            <CardDescription className="text-xs md:text-sm">Distribuição de status das propostas</CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-4 flex justify-center">
            <ResponsiveContainer width="100%" height={250} minWidth={250}>
              <PieChart>
                <Pie
                  data={mockConversionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
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

      {/* Bank Performance - Mobile First: 1 col, Desktop: full width */}
      <Card className="min-w-0 overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Performance por Banco</CardTitle>
          <CardDescription className="text-xs md:text-sm">Propostas e taxa de conversão por banco parceiro</CardDescription>
        </CardHeader>
        <CardContent className="p-2 md:p-4">
          <ResponsiveContainer width="100%" height={250} minWidth={300}>
            <BarChart data={mockBankData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="proposals" fill="#dc2626" />
              <Bar dataKey="conversion" fill="#9ca3af" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activities - Mobile First: full width */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Atividades Recentes</CardTitle>
          <CardDescription className="text-xs md:text-sm">Últimas ações no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-2 md:p-3 border-l-4 border-red-600 bg-gray-50 rounded">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">Proposta criada</p>
                <p className="text-xs text-gray-600">João Silva</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 md:mt-0">2 horas atrás</p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-2 md:p-3 border-l-4 border-red-600 bg-gray-50 rounded">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">Proposta aprovada</p>
                <p className="text-xs text-gray-600">Maria Santos</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 md:mt-0">4 horas atrás</p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-2 md:p-3 border-l-4 border-red-600 bg-gray-50 rounded">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">Novo cliente adicionado</p>
                <p className="text-xs text-gray-600">Pedro Costa</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 md:mt-0">1 dia atrás</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
