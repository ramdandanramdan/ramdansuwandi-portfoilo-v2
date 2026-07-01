'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: { date: string; count: number }[];
}

export default function VisitorsLineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
          tickFormatter={(v) => v.slice(5)}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--dark-card)',
            border: '1px solid var(--glass-border)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--text-primary)',
          }}
          labelFormatter={(v) => {
            const d = new Date(v + 'T00:00:00');
            return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
          }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="var(--electric-blue)"
          strokeWidth={2}
          dot={{ fill: 'var(--electric-blue)', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: 'var(--electric-blue)', stroke: 'var(--dark-card)', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
