import { useEffect, useState } from 'react';
import { promptsApi } from '../services/api';
import { FileText, Plus, Edit, Copy, Eye } from 'lucide-react';

export default function Prompts() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    promptsApi.getAll().then(res => { setPrompts(res.data); setLoading(false); });
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Promptها</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>مدیریت Template و Promptهای Agentها</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
          <Plus size={16} />
          Prompt جدید
        </button>
      </div>

      <div className="space-y-3">
        {prompts.map(prompt => (
          <div key={prompt.id} className="p-4 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <FileText size={18} className="text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{prompt.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>v{prompt.version}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      prompt.type === 'system' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {prompt.type === 'system' ? 'سیستمی' : 'تسک'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">فعال</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-opacity-80 transition-colors" style={{ color: 'var(--text-muted)' }}><Eye size={14} /></button>
                <button className="p-1.5 rounded-lg hover:bg-opacity-80 transition-colors" style={{ color: 'var(--text-muted)' }}><Edit size={14} /></button>
                <button className="p-1.5 rounded-lg hover:bg-opacity-80 transition-colors" style={{ color: 'var(--text-muted)' }}><Copy size={14} /></button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {prompt.variables.map((v: string, i: number) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
