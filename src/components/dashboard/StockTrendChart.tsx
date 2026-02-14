import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { stockTrendData } from '@/data/mockData';

export function StockTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={stockTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorEntrees" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(174, 62%, 35%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(174, 62%, 35%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorSorties" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(200, 10%, 48%)' }} />
        <YAxis tick={{ fontSize: 12, fill: 'hsl(200, 10%, 48%)' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(0, 0%, 100%)',
            border: '1px solid hsl(214, 20%, 90%)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Area type="monotone" dataKey="entrees" name="Entrées" stroke="hsl(174, 62%, 35%)" fill="url(#colorEntrees)" strokeWidth={2} />
        <Area type="monotone" dataKey="sorties" name="Sorties" stroke="hsl(0, 72%, 55%)" fill="url(#colorSorties)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
