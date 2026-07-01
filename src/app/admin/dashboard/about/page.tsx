'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/admin/DataTable';
import { listItems, deleteItem } from '@/lib/actions';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'skills_summary', label: 'Skills Summary' },
  { key: 'is_active', label: 'Active', render: (v: unknown) => v ? '✅' : '❌' },
];

export default function AboutPage() {
  const router = useRouter();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const data = await listItems('about');
      setItems(data as Record<string, unknown>[]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id: string) => {
    try {
      await deleteItem('about', id);
      await fetch();
      router.refresh();
    } catch (e) { console.error(e); throw e; }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <DataTable
      title="About"
      items={items}
      columns={columns}
      basePath="/admin/dashboard/about"
      section="about"
      onDelete={handleDelete}
    />
  );
}
