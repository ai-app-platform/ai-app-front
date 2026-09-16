import { useEffect, useState } from 'react';
import { knowledgeApi } from '../services/api';
import { BookOpen, Plus, FileText, Shield, Code2, Layers, Globe } from 'lucide-react';

export default function Knowledge() {
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    knowledgeApi.getAll().then(res => { setKnowledge(res.data); setLoading(false); });
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'coding-standards': return <Code2 size={16} className="text-blue-500" />;
      case 'framework-standards': return <Layers size={16} className="text-purple-500" />;
      case 'architecture': return <Globe size={16} className="text-green-500" />;
      case 'domain-rules': return <FileText size={16} className="text-amber-500" />;
      case 'testing': return <Shield size={16} className="text-cyan-500" />;
      case 'security': return <Shield size={16} className="text-red-500" />;
      default: return <BookOpen size={16} className="text-gray-500" />;
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>دانش</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>مدیریت دانش و استانداردهای پلتفرم و پروژه</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
          <Plus size={16} />
          دانش جدید
        </button>
      </div>

      {/* Scope Tabs */}
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white">همه</button>
        <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>پلتفرم</button>
        <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>پروژه</button>
      </div>

      <div className="space-y-3">
        {knowledge.map(item => (
          <div key={item.id} className="p-4 rounded-xl transition-all hover:shadow-md cursor-pointer" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                {getCategoryIcon(item.category)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.scope === 'platform' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {item.scope === 'platform' ? 'پلتفرم' : 'پروژه'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>نسخه: {item.version}</span>
                  <span>آخرین به‌روزرسانی: {item.lastUpdated}</span>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">فعال</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
