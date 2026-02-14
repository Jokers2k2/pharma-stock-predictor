import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { predictionData } from '@/data/mockData';

export function PredictionChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={predictionData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(200, 10%, 48%)' }} />
        <YAxis tick={{ fontSize: 12, fill: 'hsl(200, 10%, 48%)' }} domain={['auto', 'auto']} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(0, 0%, 100%)',
            border: '1px solid hsl(214, 20%, 90%)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <ReferenceLine y={11000} stroke="hsl(0, 72%, 55%)" strokeDasharray="5 5" label={{ value: 'Seuil critique', fontSize: 11, fill: 'hsl(0, 72%, 55%)' }} />
        <Line type="monotone" dataKey="actual" name="Stock réel" stroke="hsl(174, 62%, 35%)" strokeWidth={2} dot={{ r: 4 }} connectNulls={false} />
        <Line type="monotone" dataKey="predicted" name="Prévision" stroke="hsl(38, 92%, 55%)" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
