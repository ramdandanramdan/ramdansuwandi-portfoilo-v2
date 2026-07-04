'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/admin/DataTable';
import { listItems, deleteItem } from '@/lib/actions';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'featured', label: 'Featured', render: (v: unknown) => v ? '⭐' : '' },
  { key: 'is_active', label: 'Active', render: (v: unknown) => v ? '✅' : '❌' },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const data = await listItems('projects');
      setItems(data as Record<string, unknown>[]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id: string) => {
    try {
      await deleteItem('projects', id);
      await fetch();
      router.refresh();
    } catch (e) { console.error(e); throw e; }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;

  const professional = items.filter((i) => i.category === 'professional');
  const personal = items.filter((i) => i.category === 'personal');

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-[var(--electric-blue)]" />
          <h3 className="text-lg font-semibold text-white">Proyek Profesional</h3>
        </div>
        <DataTable
          title=""
          items={professional}
          columns={columns}
          basePath="/admin/dashboard/projects"
          section="projects"
          onDelete={handleDelete}
        />
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-[var(--neon-green)]" />
          <h3 className="text-lg font-semibold text-white">Proyek Pribadi</h3>
        </div>
        <DataTable
          title=""
          items={personal}
          columns={columns}
          basePath="/admin/dashboard/projects"
          section="projects"
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
