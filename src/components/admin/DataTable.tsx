'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
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

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(orderedItems);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

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
      setOrderedItems(items);
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

  const displayItems = orderedItems.length === items.length ? orderedItems : items;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {saving && <div className="w-4 h-4 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" />}
        </div>
        <Link href={`${basePath}/new`}>
          <button className="px-4 py-2 rounded-lg text-sm font-semibold text-black transition-all hover:shadow-lg" style={{background: 'linear-gradient(135deg, var(--electric-blue), var(--neon-green))'}}>
            + Add New
          </button>
        </Link>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center border-b border-[var(--glass-border)] text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            <div className="w-10 px-2 py-3 shrink-0" />
            {columns.map((col) => (
              <div key={col.key} className="flex-1 px-4 py-3 min-w-0">
                {col.label}
              </div>
            ))}
            <div className="w-28 px-4 py-3 text-right shrink-0">Actions</div>
          </div>

          <Droppable droppableId="table-body">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {displayItems.length === 0 ? (
                  <div className="text-center py-8 text-[var(--text-secondary)] text-sm">
                    No data found. Click &ldquo;Add New&rdquo; to create one.
                  </div>
                ) : (
                  displayItems.map((item, index) => (
                    <Draggable key={item.id as string} draggableId={item.id as string} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center border-b border-[var(--glass-border)] transition-colors ${
                            snapshot.isDragging
                              ? 'bg-[var(--electric-blue)]/10 shadow-lg'
                              : 'hover:bg-[rgba(255,255,255,0.03)]'
                          }`}
                          style={provided.draggableProps.style}
                        >
                          <div className="w-10 px-2 py-3 shrink-0 flex justify-center" {...provided.dragHandleProps}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-[var(--text-secondary)] cursor-grab active:cursor-grabbing"
                            >
                              <line x1="8" y1="6" x2="16" y2="6" />
                              <line x1="8" y1="12" x2="16" y2="12" />
                              <line x1="8" y1="18" x2="16" y2="18" />
                            </svg>
                          </div>
                          {columns.map((col) => (
                            <div key={col.key} className="flex-1 px-4 py-3 text-sm text-[var(--text-primary)] min-w-0">
                              {col.render
                                ? col.render(item[col.key], item)
                                : String(item[col.key] ?? '')}
                            </div>
                          ))}
                          <div className="w-28 px-4 py-3 shrink-0 flex items-center justify-end gap-2">
                            <Link href={`${basePath}/${item.id}`}>
                              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-black transition-colors" style={{background: 'var(--electric-blue)'}}>
                                Edit
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeleteItem(item.id as string)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}
