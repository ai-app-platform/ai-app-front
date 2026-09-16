import { useEffect, useState } from 'react';
import { workflowsApi } from '../services/api';
import { Workflow, Plus, ArrowRight, Play, Pause } from 'lucide-react';

export default function Workflows() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workflowsApi.getAll().then(res => { setWorkflows(res.data); setLoading(false); });
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-48 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Workflowها</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>تعریف و مدیریت جریان‌های کاری</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
          <Plus size={16} />
          Workflow جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map(wf => (
          <div key={wf.id} className="p-5 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Workflow size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{wf.name}</h3>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>v{wf.version}</span>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">فعال</span>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>{wf.description}</p>
            
            {/* Steps visualization */}
            <div className="flex items-center gap-1 flex-wrap mb-3">
              {wf.steps.map((step: string, i: number) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="text-xs px-2 py-1 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">{step}</span>
                  {i < wf.steps.length - 1 && <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {wf.allowParallel ? '✓ اجرای موازی' : '✗ اجرای ترتیبی'}
              </span>
              <div className="flex items-center gap-2">
                <button className="text-xs text-indigo-500 hover:text-indigo-600 flex items-center gap-1"><Play size={12} />اجرا</button>
                <button className="text-xs text-amber-500 hover:text-amber-600 flex items-center gap-1"><Pause size={12} />ویرایش</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
