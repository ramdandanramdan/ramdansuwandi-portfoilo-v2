import { getItemById } from '@/lib/actions';
import ItemForm from '@/components/admin/ItemForm';
import type { SectionName } from '@/lib/types';

const fields = [
  { name: 'title', label: 'Title', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'date', label: 'Date', type: 'date' as const },
  { name: 'issuer', label: 'Issuer', type: 'text' as const },
  { name: 'image_url', label: 'Thumbnail', type: 'file' as const, accept: 'image/*,.pdf' },
  { name: 'images', label: 'Certificate Images', type: 'multipleFiles' as const, accept: 'image/*,.pdf', maxFiles: 3 },
  { name: 'certificate_url', label: 'Certificate File (img, jpg, pdf)', type: 'file' as const, accept: 'image/*,.pdf' },
  { name: 'certificate_external_url', label: 'Certificate URL (external)', type: 'url' as const },
  { name: 'category', label: 'Category', type: 'text' as const },
  { name: 'order_index', label: 'Order', type: 'number' as const },
  { name: 'is_active', label: 'Active', type: 'checkbox' as const },
];

export default async function AchievementFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  const section: SectionName = 'achievements';
  const initialData = isNew ? null : await getItemById(section, id);

  return (
    <ItemForm
      title={isNew ? 'Create Achievement' : 'Edit Achievement'}
      fields={fields}
      initialData={initialData || {} as Record<string, unknown>}
      section={section}
      basePath="/admin/dashboard/achievements"
      itemId={isNew ? undefined : id}
      isNew={isNew}
    />
  );
}
