import { getItemById } from '@/lib/actions';
import ItemForm from '@/components/admin/ItemForm';
import type { SectionName } from '@/lib/types';

const fields = [
  { name: 'title', label: 'Title', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'image_url', label: 'Image', type: 'file' as const, accept: 'image/*,.pdf' },
  { name: 'milestones', label: 'Milestones', type: 'group' as const, fields: [
    { name: 'year', label: 'Year', type: 'text' as const, placeholder: 'e.g. 2024' },
    { name: 'title', label: 'Title', type: 'text' as const, placeholder: 'e.g. Started Career' },
    { name: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'e.g. Began professional journey' },
  ] },
  { name: 'skills_summary', label: 'Skills Summary', type: 'text' as const },
  {
    name: 'work_portfolio',
    label: 'Portofolio Kerja',
    type: 'group' as const,
    fields: [
      { name: 'title', label: 'Title', type: 'text' as const },
      { name: 'description', label: 'Description', type: 'textarea' as const },
    ],
  },
  {
    name: 'achievements',
    label: 'Prestasi',
    type: 'group' as const,
    fields: [
      { name: 'title', label: 'Title', type: 'text' as const },
      { name: 'description', label: 'Description', type: 'textarea' as const },
    ],
  },
  { name: 'is_active', label: 'Active', type: 'checkbox' as const },
];

export default async function AboutFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  const section: SectionName = 'about';
  const initialData = isNew ? null : await getItemById(section, id);

  return (
    <ItemForm
      title={isNew ? 'Create About Entry' : 'Edit About Entry'}
      fields={fields}
      initialData={initialData || {} as Record<string, unknown>}
      section={section}
      basePath="/admin/dashboard/about"
      itemId={isNew ? undefined : id}
      isNew={isNew}
    />
  );
}
