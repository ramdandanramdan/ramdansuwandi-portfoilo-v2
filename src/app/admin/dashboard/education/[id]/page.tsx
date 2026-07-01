import { getItemById } from '@/lib/actions';
import ItemForm from '@/components/admin/ItemForm';
import type { SectionName } from '@/lib/types';

const fields = [
  { name: 'school', label: 'School', type: 'text' as const, required: true },
  { name: 'degree', label: 'Degree', type: 'text' as const, required: true },
  { name: 'field_of_study', label: 'Field of Study', type: 'text' as const },
  { name: 'location', label: 'Location', type: 'text' as const },
  { name: 'start_date', label: 'Start Date', type: 'date' as const },
  { name: 'end_date', label: 'End Date', type: 'date' as const },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'grade', label: 'Grade / GPA', type: 'text' as const },
  { name: 'image_url', label: 'Thumbnail', type: 'file' as const, accept: 'image/*' },
  { name: 'images', label: 'Images', type: 'multipleFiles' as const, accept: 'image/*', maxFiles: 10 },
  { name: 'certificate_url', label: 'Certificate / Ijazah (PDF)', type: 'file' as const, accept: '.pdf' },
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

export default async function EducationFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  const section: SectionName = 'education';
  const initialData = isNew ? null : await getItemById(section, id);

  return (
    <ItemForm
      title={isNew ? 'Create Education' : 'Edit Education'}
      fields={fields}
      initialData={initialData || {} as Record<string, unknown>}
      section={section}
      basePath="/admin/dashboard/education"
      itemId={isNew ? undefined : id}
      isNew={isNew}
    />
  );
}
