import { getItemById } from '@/lib/actions';
import ItemForm from '@/components/admin/ItemForm';
import type { SectionName } from '@/lib/types';

const fields = [
  { name: 'name', label: 'Name', type: 'text' as const, required: true },
  { name: 'category', label: 'Category', type: 'text' as const },
  { name: 'proficiency', label: 'Proficiency (0-100)', type: 'number' as const },
  { name: 'icon_url', label: 'Icon', type: 'file' as const, accept: 'image/*,.svg' },
  { name: 'color', label: 'Color (hex)', type: 'text' as const, placeholder: '#00d4ff' },
  { name: 'order_index', label: 'Order', type: 'number' as const },
  { name: 'is_active', label: 'Active', type: 'checkbox' as const },
];

export default async function SkillFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  const section: SectionName = 'skills';
  const initialData = isNew ? null : await getItemById(section, id);

  return (
    <ItemForm
      title={isNew ? 'Create Skill' : 'Edit Skill'}
      fields={fields}
      initialData={initialData || {} as Record<string, unknown>}
      section={section}
      basePath="/admin/dashboard/skills"
      itemId={isNew ? undefined : id}
      isNew={isNew}
    />
  );
}
