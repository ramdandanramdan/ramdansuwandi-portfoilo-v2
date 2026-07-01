import { getItemById } from '@/lib/actions';
import ItemForm from '@/components/admin/ItemForm';
import type { SectionName } from '@/lib/types';

const fields = [
  { name: 'title', label: 'Title', type: 'text' as const, required: true },
  { name: 'subtitle', label: 'Subtitle', type: 'text' as const },
  { name: 'tagline', label: 'Tagline', type: 'text' as const, placeholder: 'e.g. Crafting Digital Excellence' },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'image_url', label: 'Image', type: 'file' as const, accept: 'image/*,.pdf' },
  { name: 'location', label: 'Location', type: 'text' as const, placeholder: 'e.g. Jakarta, Indonesia' },
  { name: 'is_available', label: 'Available for Work', type: 'checkbox' as const },
  { name: 'resume_url', label: 'Resume / CV (PDF)', type: 'file' as const, accept: '.pdf' },
  { name: 'services', label: 'Services', type: 'tags' as const, placeholder: 'e.g. Web Development' },
  { name: 'social_links', label: 'Social Links', type: 'group' as const, fields: [
    { name: 'platform', label: 'Platform', type: 'text' as const, placeholder: 'e.g. GitHub' },
    { name: 'url', label: 'URL', type: 'url' as const, placeholder: 'https://github.com/username' },
    { name: 'icon', label: 'Icon', type: 'text' as const, placeholder: 'e.g. github' },
  ] },
  { name: 'stats', label: 'Stats', type: 'group' as const, fields: [
    { name: 'label', label: 'Label', type: 'text' as const, placeholder: 'e.g. Projects Done' },
    { name: 'value', label: 'Value', type: 'text' as const, placeholder: 'e.g. 50+' },
  ] },
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

export default async function HomeFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  const section: SectionName = 'home';
  const initialData = isNew ? null : await getItemById(section, id);

  return (
    <ItemForm
      title={isNew ? 'Create Home Entry' : 'Edit Home Entry'}
      fields={fields}
      initialData={initialData || {} as Record<string, unknown>}
      section={section}
      basePath="/admin/dashboard/home"
      itemId={isNew ? undefined : id}
      isNew={isNew}
    />
  );
}
