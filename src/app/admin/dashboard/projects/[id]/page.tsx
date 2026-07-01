import { getItemById } from '@/lib/actions';
import ItemForm from '@/components/admin/ItemForm';
import type { SectionName } from '@/lib/types';

const fields = [
  { name: 'title', label: 'Title', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'image_url', label: 'Thumbnail (card background)', type: 'file' as const, accept: 'image/*' },
  { name: 'images', label: 'Gallery Images', type: 'multipleFiles' as const, accept: 'image/*', maxFiles: 10 },
  { name: 'tech_stack', label: 'Tech Stack', type: 'tags' as const, placeholder: 'Type tech name and press Enter or +' },
  { name: 'link', label: 'Link (URL / YouTube embed / anything)', type: 'url' as const },
  { name: 'live_url', label: 'Live URL', type: 'url' as const },
  { name: 'github_url', label: 'GitHub URL', type: 'url' as const },
  { name: 'category', label: 'Category', type: 'text' as const },
  { name: 'featured', label: 'Featured', type: 'checkbox' as const },
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

export default async function ProjectFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  const section: SectionName = 'projects';
  const initialData = isNew ? null : await getItemById(section, id);

  return (
    <ItemForm
      title={isNew ? 'Create Project' : 'Edit Project'}
      fields={fields}
      initialData={initialData || {} as Record<string, unknown>}
      section={section}
      basePath="/admin/dashboard/projects"
      itemId={isNew ? undefined : id}
      isNew={isNew}
    />
  );
}
