import { useEffect, useState } from 'react';
import { codebaseApi } from '../services/api';
import { Code2, FileCode, GitBranch, RefreshCw, Search, FolderTree, Layers } from 'lucide-react';

export default function Codebase() {
  const [overview, setOverview] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([codebaseApi.getOverview('p1'), codebaseApi.getModules('p1')]).then(([overviewRes, modulesRes]) => {
      setOverview(overviewRes.data);
      setModules(modulesRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="grid grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Codebase Intelligence</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>تحلیل و درک خودکار کد پروژه</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
          <RefreshCw size={14} />
          بازایندکس
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <FileCode size={20} className="text-blue-500" />
          <div className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{overview?.totalFiles}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>فایل</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <Code2 size={20} className="text-purple-500" />
          <div className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{(overview?.totalLines / 1000).toFixed(1)}K</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>خط کد</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <Layers size={20} className="text-green-500" />
          <div className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{overview?.modules}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>ماژول</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <GitBranch size={20} className="text-amber-500" />
          <div className="text-sm font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{overview?.lastAnalysis}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>آخرین تحلیل</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="w-5 h-5 rounded-full bg-green-500 animate-pulse"></div>
          <div className="text-sm font-bold mt-2" style={{ color: 'var(--text-primary)' }}>به‌روز</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>وضعیت</div>
        </div>
      </div>

      {/* Languages */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>زبان‌ها</h2>
        <div className="space-y-3">
          {Object.entries(overview?.languages || {}).map(([lang, percent]: [string, any]) => (
            <div key={lang} className="flex items-center gap-3">
              <span className="text-sm w-20" style={{ color: 'var(--text-primary)' }}>{lang}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${percent}%` }}></div>
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <FolderTree size={18} className="text-indigo-500" />
          ماژول‌ها
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map((mod, i) => (
            <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{mod.name}</h3>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{mod.files} فایل</span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>{mod.classes} کلاس</span>
                <span>•</span>
                <span>{mod.dependencies.length} وابستگی</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
