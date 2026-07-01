'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  data: { category: string; count: number }[];
}

const COLORS = ['var(--electric-blue)', 'var(--neon-green)', '#6c5ce7', '#fd79a8', '#fdcb6e', '#e17055', '#00cec9', '#0984e3'];

export default function SkillsPieChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-[var(--text-secondary)] text-xs">
        No skills data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
          dataKey="count"
          nameKey="category"
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'var(--dark-card)',
            border: '1px solid var(--glass-border)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--text-primary)',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
