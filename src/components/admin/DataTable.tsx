'use client';

import { useState } from 'react';
import Link from 'next/link';
import { updateOrderBatch } from '@/lib/actions';
import type { SectionName } from '@/lib/types';
import { useToast } from './Toast';

interface Column {
  key: string;
  label: string;
  render?: (value: unknown, item: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  items: Record<string, unknown>[];
  columns: Column[];
  basePath: string;
  section: SectionName;
  onDelete: (id: string) => void;
}

export default function DataTable({ title, items, columns, basePath, section, onDelete }: DataTableProps) {
  const [orderedItems, setOrderedItems] = useState(items);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedItems.length) return;

    const reordered = Array.from(orderedItems);
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    setOrderedItems(reordered);
    setSaving(true);

    try {
      const batch = reordered.map((item, i) => ({
        id: item.id as string,
        order_index: i,
      }));
      await updateOrderBatch(section, batch);
    } catch (e) {
      console.error(e);
      setOrderedItems(orderedItems);
      toast('Failed to save order', 'error');
    }
    setSaving(false);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await onDelete(id);
      toast('Item deleted successfully');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Failed to delete item', 'error');
    }
  };

  const allItems = orderedItems.length === items.length ? orderedItems : items;

  const ArrowBtn = ({ index, dir, label }: { index: number; dir: 'up' | 'down'; label: string }) => {
    const disabled = dir === 'up' ? index === 0 : index === allItems.length - 1;
    return (
      <button
        onClick={() => moveItem(index, dir)}
        disabled={disabled || saving}
        className={`p-1 rounded transition-all ${
          disabled
            ? 'text-[var(--glass-border)] cursor-not-allowed'
            : 'text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] cursor-pointer'
        }`}
        title={label}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {dir === 'up' ? (
            <polyline points="18 15 12 9 6 15" />
          ) : (
            <polyline points="6 9 12 15 18 9" />
          )}
        </svg>
      </button>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {title && <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>}
          {saving && <div className="w-4 h-4 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" />}
        </div>
        <Link href={`${basePath}/new`}>
          <button className="px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold text-black transition-all hover:shadow-lg whitespace-nowrap" style={{background: 'linear-gradient(135deg, var(--electric-blue), var(--neon-green))'}}>
            + Add New
          </button>
        </Link>
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl overflow-hidden">
        <div className="flex items-center border-b border-[var(--glass-border)] text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
          <div className="w-16 px-2 py-3 shrink-0 text-center">#</div>
          {columns.map((col) => (
            <div key={col.key} className="flex-1 px-4 py-3 min-w-0">{col.label}</div>
          ))}
          <div className="w-32 px-4 py-3 text-right shrink-0">Actions</div>
        </div>
        {allItems.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-secondary)] text-sm">No data found. Click &ldquo;Add New&rdquo; to create one.</div>
        ) : (
          allItems.map((item, index) => (
            <div
              key={item.id as string}
              className="flex items-center border-b border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
            >
              <div className="w-16 px-2 py-3 shrink-0 flex flex-col items-center gap-0.5">
                <ArrowBtn index={index} dir="up" label="Move up" />
                <span className="text-[11px] text-[var(--text-secondary)] font-mono leading-none">{index + 1}</span>
                <ArrowBtn index={index} dir="down" label="Move down" />
              </div>
              {columns.map((col) => (
                <div key={col.key} className="flex-1 px-4 py-3 text-sm text-[var(--text-primary)] min-w-0 truncate">
                  {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? '')}
                </div>
              ))}
              <div className="w-32 px-4 py-3 shrink-0 flex items-center justify-end gap-2">
                <Link href={`${basePath}/${item.id}`}>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-black" style={{background: 'var(--electric-blue)'}}>Edit</button>
                </Link>
                <button onClick={() => handleDeleteItem(item.id as string)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {allItems.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-secondary)] text-sm">No data found. Click &ldquo;Add New&rdquo; to create one.</div>
        ) : (
          allItems.map((item, index) => (
            <div
              key={item.id as string}
              className="bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl p-4 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <ArrowBtn index={index} dir="up" label="Move up" />
                  <span className="text-[11px] text-[var(--text-secondary)] font-mono min-w-[20px] text-center">#{index + 1}</span>
                  <ArrowBtn index={index} dir="down" label="Move down" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {columns.map((col) => (
                  <div key={col.key} className="flex items-start gap-2">
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-medium min-w-[70px] shrink-0 pt-0.5">
                      {col.label}
                    </span>
                    <span className="text-sm text-[var(--text-primary)] break-words min-w-0 flex-1">
                      {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? '—')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-[var(--glass-border)]">
                <Link href={`${basePath}/${item.id}`} className="flex-1">
                  <button className="w-full px-3 py-2 rounded-lg text-xs font-semibold text-black transition-all" style={{background: 'var(--electric-blue)'}}>Edit</button>
                </Link>
                <button
                  onClick={() => handleDeleteItem(item.id as string)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
