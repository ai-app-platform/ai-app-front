import { ReactNode } from 'react';
import { Plus, Search } from 'lucide-react';

interface EntityPageProps {
  title: string;
  subtitle: string;
  items: any[];
  loading: boolean;
  onAdd?: () => void;
  addLabel?: string;
  renderItem: (item: any, index: number) => ReactNode;
  columns?: string;
}

export default function EntityPage({ title, subtitle, items, loading, onAdd, addLabel = 'ایجاد جدید', renderItem, columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' }: EntityPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
        </div>
        {onAdd && (
          <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
            <Plus size={16} />
            {addLabel}
          </button>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`grid ${columns} gap-4`}>
          {items.map((item, i) => renderItem(item, i))}
        </div>
      )}
    </div>
  );
}
