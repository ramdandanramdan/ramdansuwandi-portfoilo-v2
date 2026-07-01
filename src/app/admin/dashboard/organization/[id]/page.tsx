import { getItemById } from '@/lib/actions';
import ItemForm from '@/components/admin/ItemForm';
import type { SectionName } from '@/lib/types';

const fields = [
  { name: 'name', label: 'Organization Name', type: 'text' as const, required: true },
  { name: 'role', label: 'Your Role', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'start_date', label: 'Start Date', type: 'date' as const },
  { name: 'end_date', label: 'End Date', type: 'date' as const },
  { name: 'image_url', label: 'Logo', type: 'file' as const, accept: 'image/*' },
  { name: 'images', label: 'Gallery Images', type: 'multipleFiles' as const, accept: 'image/*', maxFiles: 10 },
  { name: 'website_url', label: 'Website URL', type: 'url' as const },
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
  { name: 'order_index', label: 'Order', type: 'number' as const },
  { name: 'is_active', label: 'Active', type: 'checkbox' as const },
];

export default async function OrgFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  const section: SectionName = 'organization';
  const initialData = isNew ? null : await getItemById(section, id);

  return (
    <ItemForm
      title={isNew ? 'Create Organization' : 'Edit Organization'}
      fields={fields}
      initialData={initialData || {} as Record<string, unknown>}
      section={section}
      basePath="/admin/dashboard/organization"
      itemId={isNew ? undefined : id}
      isNew={isNew}
    />
  );
}
