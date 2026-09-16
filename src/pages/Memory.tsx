import { useEffect, useState } from 'react';
import { memoryApi } from '../services/api';
import { Brain, Clock, Lightbulb, AlertTriangle, History, FileText } from 'lucide-react';

export default function Memory() {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memoryApi.getProjectMemory('p1').then(res => { setMemories(res.data); setLoading(false); });
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task-state': return <Clock size={16} className="text-blue-500" />;
      case 'decision': return <Lightbulb size={16} className="text-amber-500" />;
      case 'discovery': return <FileText size={16} className="text-green-500" />;
      case 'execution-history': return <History size={16} className="text-purple-500" />;
      default: return <Brain size={16} className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'task-state': return 'وضعیت تسک';
      case 'decision': return 'تصمیم';
      case 'discovery': return 'یافته';
      case 'execution-history': return 'تاریخچه اجرا';
      default: return type;
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-24 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>حافظه</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Runtime Memory و تاریخچه اجرا</p>
      </div>

      {/* Memory Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Memory', value: '12', icon: Clock, color: 'text-blue-500' },
          { label: 'تصمیمات', value: '8', icon: Lightbulb, color: 'text-amber-500' },
          { label: 'یافته‌ها', value: '15', icon: FileText, color: 'text-green-500' },
          { label: 'تاریخچه', value: '45', icon: History, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <stat.icon size={20} className={stat.color} />
            <div className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Memory Items */}
      <div className="space-y-3">
        {memories.map(memory => (
          <div key={memory.id} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                {getTypeIcon(memory.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                    {getTypeLabel(memory.type)}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{memory.timestamp}</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{memory.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
