'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from './supabase-admin';
import type { SectionName, Contact } from './types';

const TABLE_MAP: Record<SectionName, string> = {
  home: 'home',
  about: 'about',
  experience: 'experience',
  education: 'education',
  projects: 'projects',
  skills: 'skills',
  organization: 'organization',
  achievements: 'achievements',
  contact: 'contact',
};

const STORAGE_BUCKET = 'portfolio-images';

async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.find((b) => b.name === STORAGE_BUCKET)) {
    await supabaseAdmin.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
  }
}

export async function uploadImage(file: File, folder: string = 'general') {
  await ensureBucket();

  const ext = file.name.split('.').pop() || 'png';
  const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: publicUrl } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}

export async function deleteImage(url: string) {
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `https://${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname}/storage/v1/object/public/${STORAGE_BUCKET}/`
    : '';

  if (!url?.startsWith(bucket)) return;

  const filePath = url.replace(bucket, '');
  await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([filePath]);
}

function isFile(value: FormDataEntryValue): value is File {
  return typeof value !== 'string' && 'size' in value && value.size > 0;
}

function parseFormData(formData: FormData): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (value === '' || value === undefined || value === null) continue;
    if (key.startsWith('existing_')) continue;
    if (isFile(value)) continue;

    if (value === 'true') payload[key] = true;
    else if (value === 'false') payload[key] = false;
    else {
      try { payload[key] = JSON.parse(value as string); }
      catch { payload[key] = value; }
    }
  }

  return payload;
}

export async function listItems(section: SectionName) {
  const table = TABLE_MAP[section];
  const query = supabaseAdmin.from(table).select('*');

  if (section !== 'contact') {
    query.order('order_index', { ascending: true });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function getHomeSettings() {
  const { data, error } = await supabaseAdmin
    .from('home')
    .select('social_links, resume_url')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getContactItems(type: 'social' | 'message' = 'social') {
  const query = supabaseAdmin
    .from('contact')
    .select('*')
    .eq('type', type)
    .order('order_index', { ascending: true });

  if (type === 'social') {
    query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as Contact[];
}

export async function getItemById(section: SectionName, id: string) {
  const table = TABLE_MAP[section];
  const { data, error } = await supabaseAdmin
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createItem(section: SectionName, formData: FormData) {
  const table = TABLE_MAP[section];
  const payload = parseFormData(formData);

  await ensureBucket();

  const processedKeys = new Set<string>();

  for (const [key, value] of formData.entries()) {
    if (isFile(value)) {
      if (processedKeys.has(key)) continue;

      const files = formData.getAll(key).filter(isFile);
      processedKeys.add(key);

      if (files.length > 1 || key === 'images' || key === 'documents') {
        const urls = await Promise.all(files.map((f) => uploadImage(f, section)));
        payload[key] = urls;
      } else {
        try {
          payload[key] = await uploadImage(files[0], section);
        } catch (err) {
          throw new Error(`Failed to upload ${key}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }
    }
  }

  const { data, error } = await supabaseAdmin
    .from(table)
    .insert([payload])
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/dashboard/${section}`);
  revalidatePath('/landing');
  return data;
}

export async function updateItem(section: SectionName, id: string, formData: FormData) {
  const table = TABLE_MAP[section];
  const payload = parseFormData(formData);
  const oldData = await getItemById(section, id);

  await ensureBucket();

  const processedKeys = new Set<string>();

    for (const [key, value] of formData.entries()) {
      if (isFile(value)) {
        if (processedKeys.has(key)) continue;

        const files = formData.getAll(key).filter(isFile);
        processedKeys.add(key);

        if (files.length > 1 || key === 'images' || key === 'documents') {
          const urls = await Promise.all(files.map((f) => uploadImage(f, section)));

          const existingRaw = formData.get(`existing_${key}`);
          const existingUrls: string[] = existingRaw
            ? (JSON.parse(existingRaw as string) as string[])
            : [];

          if (oldData?.[key]) {
            const oldUrls = oldData[key] as string[];
            for (const oldUrl of oldUrls) {
              if (typeof oldUrl === 'string' && !existingUrls.includes(oldUrl)) {
                try { await deleteImage(oldUrl); } catch {}
              }
            }
          }

          payload[key] = [...existingUrls, ...urls];
        } else {
          try { if (oldData?.[key]) await deleteImage(oldData[key] as string); } catch {}
          try {
            payload[key] = await uploadImage(files[0], section);
          } catch (err) {
            throw new Error(`Failed to upload ${key}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        }
      }
    }

    payload.updated_at = new Date().toISOString();

    // Handle array fields (images, documents) where items were removed without adding new files
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('existing_')) {
        const fieldName = key.replace('existing_', '');
        if (!processedKeys.has(fieldName)) {
          const existingUrls: string[] = JSON.parse(value as string) as string[];

          if (oldData?.[fieldName]) {
            const oldUrls = oldData[fieldName] as string[];
            for (const oldUrl of oldUrls) {
              if (typeof oldUrl === 'string' && !existingUrls.includes(oldUrl)) {
                try { await deleteImage(oldUrl); } catch {}
              }
            }
          }

          payload[fieldName] = existingUrls;
        }
      }
    }

    // Detect removed single-file fields (user cleared the image without uploading a new one)
    for (const [key, oldValue] of Object.entries(oldData || {})) {
      if (typeof oldValue === 'string' && oldValue.startsWith('http') && !(key in payload) && !processedKeys.has(key)) {
        try { await deleteImage(oldValue); } catch {}
        payload[key] = null;
      }
    }

  const { data, error } = await supabaseAdmin
    .from(table)
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/dashboard/${section}`);
  revalidatePath('/landing');
  return data;
}

export async function updateContactField(id: string, field: string, value: boolean) {
  const { error } = await supabaseAdmin
    .from('contact')
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/dashboard/contact');
}

export async function updateResumeUrl(url: string) {
  const { data: first } = await supabaseAdmin.from('home').select('id').eq('is_active', true).order('order_index').limit(1).maybeSingle();
  if (!first) return;
  const { error } = await supabaseAdmin.from('home').update({ resume_url: url, updated_at: new Date().toISOString() }).eq('id', first.id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/dashboard/contact');
  revalidatePath('/landing');
}

export async function updateOrderBatch(section: SectionName, items: { id: string; order_index: number }[]) {
  const table = TABLE_MAP[section];
  const now = new Date().toISOString();
  const errors: string[] = [];

  for (const item of items) {
    const { error } = await supabaseAdmin
      .from(table)
      .update({ order_index: item.order_index, updated_at: now })
      .eq('id', item.id);
    if (error) errors.push(error.message);
  }

  if (errors.length > 0) throw new Error(errors.join(', '));
  revalidatePath(`/admin/dashboard/${section}`);
  revalidatePath('/landing');
}

export async function deleteItem(section: SectionName, id: string) {
  const table = TABLE_MAP[section];
  const { error } = await supabaseAdmin
    .from(table)
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/dashboard/${section}`);
  revalidatePath('/landing');
}
