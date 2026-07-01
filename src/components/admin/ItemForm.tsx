'use client';

import { useState, FormEvent, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createItem, updateItem } from '@/lib/actions';
import type { SectionName } from '@/lib/types';
import ImageCropper from './ImageCropper';
import { useToast } from './Toast';

interface GroupSubField {
  name: string;
  label: string;
  type: 'text' | 'url' | 'textarea';
  placeholder?: string;
}

interface Field {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'url' | 'date' | 'email' | 'checkbox' | 'json' | 'file' | 'tags' | 'group' | 'multipleFiles' | 'documents' | 'hidden';
  required?: boolean;
  placeholder?: string;
  accept?: string;
  defaultValue?: string;
  fields?: GroupSubField[];
  maxFiles?: number;
}

interface ItemFormProps {
  title: string;
  fields: Field[];
  initialData?: Record<string, unknown>;
  section: SectionName;
  basePath: string;
  itemId?: string;
  isNew: boolean;
}

export default function ItemForm({ title, fields, initialData, section, basePath, itemId, isNew }: ItemFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData || {});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { toast } = useToast();

  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [expandedGroupField, setExpandedGroupField] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropFieldName, setCropFieldName] = useState<string>('');
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const cropFieldTypeRef = useRef<'single' | 'multiple'>('single');
  const cropPendingFilesRef = useRef<File[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== '') {
          if (Array.isArray(v) && v.some((item) => item instanceof File || typeof item === 'string')) {
            const existingUrls = v.filter((item): item is string => typeof item === 'string');
            if (existingUrls.length > 0) {
              formPayload.append(`existing_${k}`, JSON.stringify(existingUrls));
            }
            v.forEach((item) => {
              if (item instanceof File) {
                formPayload.append(k, item);
              }
            });
          } else if (v instanceof File) {
            formPayload.append(k, v);
          } else if (typeof v === 'object') {
            formPayload.append(k, JSON.stringify(v));
          } else {
            formPayload.append(k, String(v));
          }
        }
      });

      if (isNew) {
        await createItem(section, formPayload);
        toast('Item created successfully');
      } else if (itemId) {
        await updateItem(section, itemId, formPayload);
        toast('Item updated successfully');
      }
      router.push(basePath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      toast(err instanceof Error ? err.message : 'Something went wrong', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    if (file) {
      if (file.type.startsWith('image/')) {
        cropFieldTypeRef.current = 'single';
        setCropFieldName(name);
        cropPendingFilesRef.current = [file];
        setCropImageSrc(URL.createObjectURL(file));
      } else {
        handleChange(name, file);
        setCropImageSrc(null);
      }
    }
  };

  const handleCropSave = useCallback((croppedFile: File) => {
    const fieldName = cropFieldName;
    if (cropFieldTypeRef.current === 'single') {
      handleChange(fieldName, croppedFile);
      const previewUrl = URL.createObjectURL(croppedFile);
      setPreviews((prev) => ({ ...prev, [fieldName]: previewUrl }));
      setCropImageSrc(null);
    } else {
      const current = [...(Array.isArray(formData[fieldName]) ? (formData[fieldName] as (string | File)[]) : [])];
      const next = [...current, croppedFile];
      handleChange(fieldName, next);
    }
  }, [cropFieldName, formData]);

  const handleRemoveFile = (name: string) => {
    handleChange(name, '');
    setPreviews((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    if (fileInputRefs.current[name]) {
      fileInputRefs.current[name]!.value = '';
    }
  };

  const handleAddTag = (name: string) => {
    const input = tagInputs[name]?.trim();
    if (!input) return;

    const currentTags: string[] = Array.isArray(formData[name]) ? (formData[name] as string[]) : [];
    if (!currentTags.includes(input)) {
      handleChange(name, [...currentTags, input]);
    }
    setTagInputs((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRemoveTag = (name: string, index: number) => {
    const currentTags: string[] = Array.isArray(formData[name]) ? (formData[name] as string[]) : [];
    handleChange(name, currentTags.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (name: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(name);
    }
  };

  const handleGroupItemChange = (name: string, index: number, subField: string, value: string) => {
    const current = [...(Array.isArray(formData[name]) ? (formData[name] as Record<string, string>[]) : [])];
    if (!current[index]) current[index] = {};
    current[index] = { ...current[index], [subField]: value };
    handleChange(name, current);
  };

  const handleAddGroupItem = (name: string) => {
    const current = [...(Array.isArray(formData[name]) ? (formData[name] as Record<string, string>[]) : [])];
    current.push({});
    handleChange(name, current);
  };

  const handleRemoveGroupItem = (name: string, index: number) => {
    const current = [...(Array.isArray(formData[name]) ? (formData[name] as Record<string, string>[]) : [])];
    current.splice(index, 1);
    handleChange(name, current);
  };

  const renderField = (field: Field) => {
    const value = formData[field.name] ?? field.defaultValue ?? '';

    if (field.type === 'hidden') {
      return <input type="hidden" name={field.name} value={value as string} />;
    }

    if (field.type === 'textarea') {
      const isExpanded = expandedField === field.name;
      return (
        <div className="space-y-2">
          <div className={`relative ${isExpanded ? 'fixed inset-4 z-50 flex flex-col bg-[var(--dark-card)] border border-[var(--electric-blue)]/30 rounded-xl p-4 shadow-2xl' : ''}`}>
            {isExpanded && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">{field.label}</span>
                <button
                  type="button"
                  onClick={() => setExpandedField(null)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-[var(--electric-blue)]/10 text-[var(--electric-blue)] border border-[var(--electric-blue)]/20 hover:bg-[var(--electric-blue)]/20 transition-colors"
                >
                  ✕ Close
                </button>
              </div>
            )}
            <textarea
              value={value as string}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={`textarea-field ${isExpanded ? 'min-h-[60vh] flex-1' : 'min-h-[200px]'}`}
              rows={isExpanded ? 30 : 8}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
          <button
            type="button"
            onClick={() => setExpandedField(isExpanded ? null : field.name)}
            className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--electric-blue)] transition-colors flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            {isExpanded ? 'Minimize' : 'Expand'}
          </button>
        </div>
      );
    }

    if (field.type === 'checkbox') {
      return (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => handleChange(field.name, e.target.checked)}
          className="w-5 h-5 rounded accent-[#00d4ff]"
        />
      );
    }

    if (field.type === 'file') {
      const currentValue = formData[field.name] as string | File | null | undefined;
      const existingUrl = typeof currentValue === 'string' && currentValue.startsWith('http') ? currentValue : null;
      const previewUrl = previews[field.name] || existingUrl;
      const isImage = previewUrl ? /\.(jpg|jpeg|png|gif|webp|avif|svg|bmp|ico)(\?.*)?$/i.test(previewUrl) : false;

      return (
        <div className="space-y-3">
          {previewUrl && isImage && (
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-xs max-h-48 rounded-lg object-contain border border-[var(--glass-border)] bg-black/20"
              />
              <button
                type="button"
                onClick={() => handleRemoveFile(field.name)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          )}
          {previewUrl && !isImage && (
            <div className="relative inline-block">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.03)]">
                <span className="text-lg">📄</span>
                <span className="text-sm text-[var(--text-secondary)] truncate max-w-[200px]">
                  {typeof currentValue === 'string' ? decodeURIComponent(currentValue.split('/').pop() || 'File') : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(field.name)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors text-sm text-[var(--text-secondary)]">
              <span>📁</span>
              Choose File
              <input
                ref={(el) => { fileInputRefs.current[field.name] = el; }}
                type="file"
                accept={field.accept || 'image/*,.pdf'}
                onChange={(e) => handleFileChange(field.name, e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {currentValue instanceof File && (
              <span className="text-sm text-[var(--text-secondary)] truncate max-w-[200px]">
                {currentValue.name}
              </span>
            )}
          </div>
        </div>
      );
    }

    if (field.type === 'tags') {
      const tags: string[] = Array.isArray(formData[field.name]) ? (formData[field.name] as string[]) : [];

      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(0, 212, 255, 0.15)',
                  color: 'var(--electric-blue)',
                  border: '1px solid rgba(0, 212, 255, 0.25)',
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(field.name, i)}
                  className="hover:opacity-70 transition-opacity text-xs"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInputs[field.name] || ''}
              onChange={(e) => setTagInputs((prev) => ({ ...prev, [field.name]: e.target.value }))}
              onKeyDown={(e) => handleTagKeyDown(field.name, e)}
              placeholder={field.placeholder || 'Add tech...'}
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={() => handleAddTag(field.name)}
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--electric-blue), var(--neon-green))',
                color: '#000',
              }}
            >
              +
            </button>
          </div>
        </div>
      );
    }

    if (field.type === 'group') {
      const items: Record<string, string>[] = Array.isArray(formData[field.name]) ? (formData[field.name] as Record<string, string>[]) : [];

      return (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="border border-[var(--glass-border)] rounded-lg p-4 space-y-3 bg-[rgba(255,255,255,0.02)]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[var(--glass-border)]">
                <span className="text-xs font-medium text-[var(--electric-blue)]">
                  {field.label} #{i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveGroupItem(field.name, i)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  ✕ Remove
                </button>
              </div>
              {(field.fields || []).map((sub) => (
                <div key={sub.name}>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">{sub.label}</label>
                  {sub.type === 'textarea' ? (
                    <div className="space-y-2">
                      <div className={`relative ${expandedGroupField === `${field.name}-${i}-${sub.name}` ? 'fixed inset-4 z-50 flex flex-col bg-[var(--dark-card)] border border-[var(--electric-blue)]/30 rounded-xl p-4 shadow-2xl' : ''}`}>
                        {expandedGroupField === `${field.name}-${i}-${sub.name}` && (
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-white">{sub.label}</span>
                            <button
                              type="button"
                              onClick={() => setExpandedGroupField(null)}
                              className="px-3 py-1.5 text-xs rounded-lg bg-[var(--electric-blue)]/10 text-[var(--electric-blue)] border border-[var(--electric-blue)]/20 hover:bg-[var(--electric-blue)]/20 transition-colors"
                            >
                              ✕ Close
                            </button>
                          </div>
                        )}
                        <textarea
                          value={item[sub.name] || ''}
                          onChange={(e) => handleGroupItemChange(field.name, i, sub.name, e.target.value)}
                          className={`input-field text-sm ${expandedGroupField === `${field.name}-${i}-${sub.name}` ? 'min-h-[60vh] flex-1' : 'min-h-[120px]'}`}
                          rows={expandedGroupField === `${field.name}-${i}-${sub.name}` ? 30 : 5}
                          placeholder={sub.placeholder}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedGroupField(expandedGroupField === `${field.name}-${i}-${sub.name}` ? null : `${field.name}-${i}-${sub.name}`)}
                        className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--electric-blue)] transition-colors flex items-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                        {expandedGroupField === `${field.name}-${i}-${sub.name}` ? 'Minimize' : 'Expand'}
                      </button>
                    </div>
                  ) : (
                    <input
                      type={sub.type === 'url' ? 'url' : 'text'}
                      value={item[sub.name] || ''}
                      onChange={(e) => handleGroupItemChange(field.name, i, sub.name, e.target.value)}
                      className="input-field text-sm"
                      placeholder={sub.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddGroupItem(field.name)}
            className="w-full py-2.5 rounded-lg border border-dashed border-[var(--glass-border)] text-sm text-[var(--text-secondary)] hover:text-[var(--electric-blue)] hover:border-[var(--electric-blue)] transition-all"
          >
            + Add {field.label}
          </button>
        </div>
      );
    }

    if (field.type === 'documents') {
      if (typeof formData[field.name] === 'string') {
        try {
          const parsed = JSON.parse(formData[field.name] as string);
          if (Array.isArray(parsed)) formData[field.name] = parsed;
        } catch {}
      }
      const items: (string | File)[] = Array.isArray(formData[field.name]) ? (formData[field.name] as (string | File)[]) : [];
      const maxFiles = field.maxFiles || 10;
      const isPdf = (url: string) => /\.pdf$/i.test(url);

      return (
        <div className="space-y-3">
          {items.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map((item, i) => {
                const url = typeof item === 'string' ? item : URL.createObjectURL(item);
                const name = typeof item === 'string'
                  ? decodeURIComponent(url.split('/').pop() || `Document ${i + 1}`)
                  : item.name;
                return (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-[var(--glass-border)] bg-[rgba(255,255,255,0.03)]">
                    <div className="w-full h-28 flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">{isPdf(url) ? '📄' : '📎'}</span>
                      <span className="text-[10px] text-[var(--text-secondary)] text-center px-2 leading-tight line-clamp-2">{name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = items.filter((_, j) => j !== i);
                        handleChange(field.name, next);
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500/90 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {items.length < maxFiles && (
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[var(--electric-blue)] transition-all text-sm text-[var(--text-secondary)]">
              <span>📁</span>
              Add Documents ({items.length}/{maxFiles})
              <input
                type="file"
                multiple
                accept={field.accept || '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar'}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const remaining = maxFiles - items.length;
                  const newFiles = files.slice(0, remaining);
                  if (newFiles.length > 0) {
                    handleChange(field.name, [...items, ...newFiles]);
                  }
                  e.target.value = '';
                }}
                className="hidden"
              />
            </label>
          )}
        </div>
      );
    }

    if (field.type === 'multipleFiles') {
      const items: (string | File)[] = Array.isArray(formData[field.name]) ? (formData[field.name] as (string | File)[]) : [];
      const maxFiles = field.maxFiles || 10;
      const isPdf = (url: string) => /\.pdf$/i.test(url);

      return (
        <div className="space-y-3">
          {items.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map((item, i) => {
                const url = typeof item === 'string' ? item : URL.createObjectURL(item);
                const name = typeof item === 'string'
                  ? decodeURIComponent(url.split('/').pop() || `File ${i + 1}`)
                  : item.name;
                return (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-[var(--glass-border)] bg-[rgba(255,255,255,0.03)]">
                    <div className="w-full h-28 flex flex-col items-center justify-center gap-1">
                      {isPdf(url) ? (
                        <>
                          <span className="text-3xl">📄</span>
                          <span className="text-[10px] text-[var(--text-secondary)] text-center px-2 leading-tight line-clamp-2">{name}</span>
                        </>
                      ) : (
                        <img
                          src={url}
                          alt={`${field.label} ${i + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = items.filter((_, j) => j !== i);
                        handleChange(field.name, next);
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500/90 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {items.length < maxFiles && (
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[var(--electric-blue)] transition-all text-sm text-[var(--text-secondary)]">
              <span>📁</span>
              Add Files ({items.length}/{maxFiles})
              <input
                type="file"
                multiple
                accept={field.accept || 'image/*'}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const remaining = maxFiles - items.length;
                  const newFiles = files.slice(0, remaining);
                  if (newFiles.length > 0) {
                    if (newFiles[0].type.startsWith('image/')) {
                      cropFieldTypeRef.current = 'multiple';
                      setCropFieldName(field.name);
                      cropPendingFilesRef.current = newFiles;
                      setCropImageSrc(URL.createObjectURL(newFiles[0]));
                    } else {
                      handleChange(field.name, [...items, ...newFiles]);
                    }
                  }
                  e.target.value = '';
                }}
                className="hidden"
              />
            </label>
          )}
        </div>
      );
    }

    return (
      <input
        type={field.type === 'url' ? 'url' : field.type}
        value={value as string}
        onChange={(e) => handleChange(field.name, e.target.value)}
        className="input-field"
        placeholder={field.placeholder}
        required={field.required}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href={basePath} className="text-[var(--text-secondary)] hover:text-white text-sm mb-2 block">
            ← Back to {title.split(' ')[0]}
          </Link>
          <h2 className="text-2xl font-bold text-gradient">{title}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">{field.label}</label>
            {renderField(field)}
          </div>
        ))}

        {error && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-red-400 text-sm"
          >
            {error}
          </motion.p>
        )}

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex items-center gap-2"
          >
            {submitting && (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            )}
            {isNew ? 'Create' : 'Update'}
          </button>
          <Link href={basePath}>
            <button type="button" className="px-4 py-2 text-[var(--text-secondary)] hover:text-white transition-colors">
              Cancel
            </button>
          </Link>
        </div>
      </form>

      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          onCancel={() => {
            cropPendingFilesRef.current = [];
            setCropImageSrc(null);
          }}
          onSave={handleCropSave}
          onSaveBatch={(files) => {
            const fieldName = cropFieldName;
            const current = Array.isArray(formData[fieldName]) ? [...(formData[fieldName] as (string | File)[])] : [];
            handleChange(fieldName, [...current, ...files]);
            setCropImageSrc(null);
          }}
          batchFiles={cropFieldTypeRef.current === 'multiple' ? cropPendingFilesRef.current.slice(1) : undefined}
        />
      )}
    </motion.div>
  );
}
