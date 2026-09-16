import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toolsApi } from '../services/api';
import EntityPage from '../components/EntityPage';
import { Wrench, Shield, Code2, Globe } from 'lucide-react';

export default function Tools() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    toolsApi.getAll().then(res => { setTools(res.data); setLoading(false); });
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INTERNAL': return <Code2 size={16} className="text-blue-500" />;
      case 'HTTP': return <Globe size={16} className="text-green-500" />;
      default: return <Wrench size={16} className="text-gray-500" />;
    }
  };

  return (
    <EntityPage
      title="ابزارها"
      subtitle="مدیریت ابزارهای قابل استفاده توسط Agentها"
      items={tools}
      loading={loading}
      addLabel="ابزار جدید"
      onAdd={() => window.location.href = '/tools/new'}
      renderItem={(tool) => (
        <Link key={tool.id} to={`/tools/${tool.id}`} className="block p-5 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              {getTypeIcon(tool.type)}
            </div>
            <div>
              <h3 className="font-semibold text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{tool.name}</h3>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>v{tool.version} • {tool.type}</span>
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{tool.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {tool.capabilities.slice(0, 2).map((cap: string, i: number) => (
                <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">{cap}</span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Shield size={12} className="text-green-500" />
              <span className="text-xs text-green-500">فعال</span>
            </div>
          </div>
        </Link>
      )}
    />
  );
}
