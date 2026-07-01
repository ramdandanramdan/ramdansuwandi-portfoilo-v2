'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/admin/DataTable';
import { listItems, deleteItem } from '@/lib/actions';

const columns = [
  {
    key: 'image_url',
    label: '',
    render: (v: unknown) => v
      ? <img src={v as string} alt="" className="w-10 h-10 rounded object-cover border border-[var(--glass-border)]" />
      : <div className="w-10 h-10 rounded border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)]/30 text-xs">—</div>,
  },
  { key: 'school', label: 'School' },
  { key: 'degree', label: 'Degree' },
  { key: 'field_of_study', label: 'Field of Study' },
  {
    key: 'certificate_url',
    label: 'Cert',
    render: (v: unknown) => v
      ? <span className="text-xs text-[var(--neon-green)]">📄</span>
      : <span className="text-xs text-[var(--text-secondary)]/30">—</span>,
  },
  { key: 'is_active', label: 'Active', render: (v: unknown) => v ? '✅' : '❌' },
];

export default function EducationPage() {
  const router = useRouter();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const data = await listItems('education');
      setItems(data as Record<string, unknown>[]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id: string) => {
    try {
      await deleteItem('education', id);
      await fetch();
      router.refresh();
    } catch (e) { console.error(e); throw e; }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <DataTable
      title="Education"
      items={items}
      columns={columns}
      basePath="/admin/dashboard/education"
      section="education"
      onDelete={handleDelete}
    />
  );
}
