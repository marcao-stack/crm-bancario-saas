import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Users, Lock, Bell, Sliders } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">Acesso restrito a administradores</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-gray-600 mt-2">Gerencie as configurações do sistema</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Sliders className="w-4 h-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="w-4 h-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Informações básicas do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">Nome da Empresa</label>
                <Input defaultValue="CRM Bancário SaaS" className="mt-2" />
              </div>

              <div>
                <label className="text-sm font-medium">Email de Contato</label>
                <Input type="email" defaultValue="contato@crmbancario.com" className="mt-2" />
              </div>

              <div>
                <label className="text-sm font-medium">Telefone</label>
                <Input defaultValue="(11) 9999-9999" className="mt-2" />
              </div>

              <div>
                <label className="text-sm font-medium">Endereço</label>
                <Input defaultValue="São Paulo, SP - Brasil" className="mt-2" />
              </div>

              <div>
                <label className="text-sm font-medium">Timezone</label>
                <Select defaultValue="america/sao_paulo">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america/sao_paulo">America/São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="america/new_york">America/New York (GMT-5)</SelectItem>
                    <SelectItem value="europe/london">Europe/London (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-red-600 hover:bg-red-700 gap-2">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>Controle de acesso e permissões</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "João Silva", email: "joao@crmbancario.com", role: "Consultor", status: "Ativo" },
                  { name: "Maria Santos", email: "maria@crmbancario.com", role: "Gerente", status: "Ativo" },
                  { name: "Carlos Oliveira", email: "carlos@crmbancario.com", role: "Operador", status: "Ativo" },
                  { name: "Ana Costa", email: "ana@crmbancario.com", role: "Consultor", status: "Inativo" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{user.role}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          user.status === "Ativo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Editar</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Proteção e controle de acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">Autenticação de Dois Fatores</p>
                  <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">Expiração de Sessão</p>
                  <p className="text-sm text-gray-600">Tempo máximo de inatividade: 30 minutos</p>
                </div>
                <Input type="number" defaultValue="30" className="w-20" />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">Requisitar Senha Forte</p>
                  <p className="text-sm text-gray-600">Mínimo 12 caracteres com números e símbolos</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">Auditoria de Acesso</p>
                  <p className="text-sm text-gray-600">Registrar todos os acessos ao sistema</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="bg-red-600 hover:bg-red-700 gap-2">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Controle de alertas e comunicações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">Notificações por Email</p>
                  <p className="text-sm text-gray-600">Receber alertas importantes por email</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">Notificações de Proposta Aprovada</p>
                  <p className="text-sm text-gray-600">Alertar quando uma proposta for aprovada</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">Notificações de Proposta Reprovada</p>
                  <p className="text-sm text-gray-600">Alertar quando uma proposta for reprovada</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">Resumo Diário</p>
                  <p className="text-sm text-gray-600">Receber resumo das atividades do dia</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">Resumo Semanal</p>
                  <p className="text-sm text-gray-600">Receber resumo das atividades da semana</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="bg-red-600 hover:bg-red-700 gap-2">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
