import { StatsCard } from '@/components/StatsCard';
import { useData } from '@/hooks/useData';
import { TrendingUp, Scale, DollarSign, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
];

export default function Dashboard() {
  const { collections, sales, productTypes } = useData();

  // Calculate stats
  const totalCollected = collections.reduce((sum, c) => sum + c.weight, 0);
  const totalSold = sales.reduce((sum, s) => sum + s.weight, 0);
  const stockBalance = totalCollected - totalSold;
  const totalRevenue = sales.reduce((sum, s) => sum + s.value, 0);

  // Collections by material type
  const collectionsByType = collections.reduce((acc, collection) => {
    const supplier = collection.supplierName;
    const existing = acc.find((item) => item.name === supplier);
    if (existing) {
      existing.value += collection.weight;
    } else {
      acc.push({ name: supplier, value: collection.weight });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Sales by product type
  const salesByProduct = sales.reduce((acc, sale) => {
    const existing = acc.find((item) => item.name === sale.productType);
    if (existing) {
      existing.value += sale.weight;
    } else {
      acc.push({ name: sale.productType, value: sale.weight });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Monthly data (mock for demonstration)
  const monthlyData = [
    { month: 'Jan', coletas: 1200, vendas: 1000 },
    { month: 'Fev', coletas: 1500, vendas: 1200 },
    { month: 'Mar', coletas: 1800, vendas: 1600 },
    { month: 'Abr', coletas: 1600, vendas: 1400 },
    { month: 'Mai', coletas: 2000, vendas: 1800 },
    { month: 'Jun', coletas: 2200, vendas: 2000 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Coletado"
          value={`${totalCollected.toFixed(0)} kg`}
          icon={Scale}
          description="Peso total de resíduos coletados"
        />
        <StatsCard
          title="Total Vendido"
          value={`${totalSold.toFixed(0)} kg`}
          icon={TrendingUp}
          description="Peso total de produtos vendidos"
        />
        <StatsCard
          title="Estoque Atual"
          value={`${stockBalance.toFixed(0)} kg`}
          icon={Package}
          description="Saldo em estoque"
        />
        <StatsCard
          title="Receita Total"
          value={`R$ ${totalRevenue.toLocaleString('pt-BR')}`}
          icon={DollarSign}
          description="Receita de vendas"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bar Chart - Monthly Overview */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Movimentação Mensal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Bar
                dataKey="coletas"
                name="Coletas (kg)"
                fill="hsl(var(--primary))"
              />
              <Bar
                dataKey="vendas"
                name="Vendas (kg)"
                fill="hsl(var(--accent))"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart - Collections by Supplier */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Coletas por Fornecedor
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={collectionsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
              >
                {collectionsByType.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Sales by Product Type */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Vendas por Tipo de Produto
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesByProduct} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis
              dataKey="name"
              type="category"
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="value" name="Peso (kg)" fill="hsl(var(--accent))" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
