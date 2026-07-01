'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: { date: string; count: number }[];
}

export default function MessagesAreaChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
        <defs>
          <linearGradient id="msgGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--neon-green)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--neon-green)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="count" stroke="var(--neon-green)" strokeWidth={2} fill="url(#msgGradient)" dot={{ fill: 'var(--neon-green)', r: 3, strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
