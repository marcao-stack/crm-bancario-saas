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
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Bem-vindo, <span className="font-semibold">{user?.name || "Usuário"}</span>! Aqui está um resumo de suas operações.
        </p>
      </div>

      {/* KPI Cards - Mobile First Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total de Propostas */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total de Propostas</CardTitle>
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">328</div>
            <p className="text-xs text-muted-foreground mt-1">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        {/* Taxa de Conversão */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">76.2%</div>
            <p className="text-xs text-muted-foreground mt-1">+3.2% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        {/* Clientes Ativos */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground mt-1">+28 novos clientes</p>
          </CardContent>
        </Card>

        {/* Volume Financeiro */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Volume Financeiro</CardTitle>
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">R$ 8.2M</div>
            <p className="text-xs text-muted-foreground mt-1">+18% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Mobile First Stacked Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Proposals Over Time */}
        <Card className="border-border/50 overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Propostas por Mês</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Tendência de propostas criadas, aprovadas e rejeitadas</CardDescription>
          </CardHeader>
          <CardContent className="pb-2 sm:pb-4">
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockProposalsData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#000000"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="approved"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Aprovadas"
                  />
                  <Line
                    type="monotone"
                    dataKey="rejected"
                    stroke="#9ca3af"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Rejeitadas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate Pie Chart */}
        <Card className="border-border/50 overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Taxa de Conversão</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Distribuição de status das propostas</CardDescription>
          </CardHeader>
          <CardContent className="pb-2 sm:pb-4">
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
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
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bank Performance Chart */}
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Performance por Banco</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Propostas e taxa de conversão por banco parceiro</CardDescription>
        </CardHeader>
        <CardContent className="pb-2 sm:pb-4">
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockBankData}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="proposals" fill="#000000" name="Propostas" />
                <Bar dataKey="conversion" fill="#dc2626" name="Conversão %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-border/50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {[
              { action: "Proposta criada", client: "João Silva", time: "2 horas atrás" },
              { action: "Proposta aprovada", client: "Maria Santos", time: "4 horas atrás" },
              { action: "Cliente adicionado", client: "Pedro Costa", time: "1 dia atrás" },
              { action: "Proposta rejeitada", client: "Ana Oliveira", time: "2 dias atrás" },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-border/50 last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium truncate">{activity.action}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{activity.client}</p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
