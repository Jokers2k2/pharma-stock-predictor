import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { topMovingProducts } from '@/data/mockData';

export function TopProductsChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={topMovingProducts} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: 'hsl(200, 10%, 48%)' }} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: 'hsl(200, 10%, 48%)' }} width={100} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(0, 0%, 100%)',
            border: '1px solid hsl(214, 20%, 90%)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`${value} unités`, 'Sorties']}
        />
        <Bar dataKey="sorties" fill="hsl(174, 62%, 35%)" radius={[0, 6, 6, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
