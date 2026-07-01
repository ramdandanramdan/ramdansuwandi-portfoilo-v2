import { getItemById } from '@/lib/actions';
import ItemForm from '@/components/admin/ItemForm';
import type { SectionName } from '@/lib/types';

const fields = [
  { name: 'title', label: 'Title', type: 'text' as const, required: true },
  { name: 'company', label: 'Company', type: 'text' as const, required: true },
  { name: 'position', label: 'Position', type: 'text' as const, required: true },
  { name: 'location', label: 'Location', type: 'text' as const },
  { name: 'start_date', label: 'Start Date', type: 'date' as const },
  { name: 'end_date', label: 'End Date', type: 'date' as const },
  { name: 'description', label: 'Description', type: 'textarea' as const },
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
  { name: 'images', label: 'Images', type: 'multipleFiles' as const, accept: 'image/*', maxFiles: 10 },
  { name: 'documents', label: 'Documents', type: 'documents' as const, maxFiles: 10 },
  { name: 'order_index', label: 'Order', type: 'number' as const },
  { name: 'is_active', label: 'Active', type: 'checkbox' as const },
];

export default async function ExperienceFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  const section: SectionName = 'experience';
  const initialData = isNew ? null : await getItemById(section, id);

  return (
    <ItemForm
      title={isNew ? 'Create Experience' : 'Edit Experience'}
      fields={fields}
      initialData={initialData || {} as Record<string, unknown>}
      section={section}
      basePath="/admin/dashboard/experience"
      itemId={isNew ? undefined : id}
      isNew={isNew}
    />
  );
}
