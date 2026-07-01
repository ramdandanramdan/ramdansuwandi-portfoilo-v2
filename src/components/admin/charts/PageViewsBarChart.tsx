'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: { page: string; count: number }[];
}

export default function PageViewsBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
        <XAxis type="number" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="page"
          tick={{ fill: 'var(--text-secondary)', fontSize: 9 }}
          tickLine={false}
          axisLine={false}
          width={90}
          tickFormatter={(v) => v.length > 12 ? v.slice(0, 12) + '..' : v}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--dark-card)',
            border: '1px solid var(--glass-border)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--text-primary)',
          }}
        />
        <Bar dataKey="count" fill="var(--electric-blue)" radius={[0, 4, 4, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
