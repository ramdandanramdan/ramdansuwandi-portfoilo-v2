import { getItemById } from '@/lib/actions';
import ContactFormClient from './ContactFormClient';
import type { SectionName } from '@/lib/types';

export default async function ContactFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  const section: SectionName = 'contact';
  const initialData = isNew ? null : await getItemById(section, id);
  const itemType = initialData?.type as string | undefined;

  const isSocial = isNew || itemType === 'social';

  return (
    <ContactFormClient
      isNew={isNew}
      isSocial={isSocial}
      initialData={initialData || {}}
      section={section}
      itemId={isNew ? undefined : id}
    />
  );
}
