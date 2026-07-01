import { getContactItems, getHomeSettings } from '@/lib/actions';
import ContactView from './ContactView';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const [socials, home] = await Promise.all([
    getContactItems('social'),
    getHomeSettings(),
  ]);

  return <ContactView socials={socials ?? []} resumeUrl={home?.resume_url ?? null} />;
}
