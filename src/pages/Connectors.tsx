import { useEffect, useState } from 'react';
import { connectorsApi } from '../services/api';
import { Plug, Plus, CheckCircle2, XCircle, RefreshCw, Globe, GitBranch, Database, Bell } from 'lucide-react';

export default function Connectors() {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    connectorsApi.getAll().then(res => { setConnectors(res.data); setLoading(false); });
  }, []);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'github': return <GitBranch size={20} className="text-gray-700 dark:text-gray-300" />;
      case 'gitlab': return <GitBranch size={20} className="text-orange-500" />;
      case 'jira': return <Database size={20} className="text-blue-500" />;
      case 'slack': return <Bell size={20} className="text-purple-500" />;
      case 'aws-s3': return <Database size={20} className="text-amber-500" />;
      default: return <Globe size={20} className="text-gray-500" />;
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-48 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>اتصال‌دهنده‌ها</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>مدیریت اتصال به سیستم‌های خارجی</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
          <Plus size={16} />
          اتصال جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectors.map(connector => (
          <div key={connector.id} className="p-5 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  {getProviderIcon(connector.provider)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{connector.name}</h3>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{connector.provider} • {connector.type}</span>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                connector.status === 'connected' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {connector.status === 'connected' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                {connector.status === 'connected' ? 'متصل' : 'قطع'}
              </div>
            </div>

            {connector.repository && (
              <p className="text-xs mb-3 font-mono px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                {connector.repository}
              </p>
            )}

            <div className="flex flex-wrap gap-1 mb-3">
              {connector.capabilities.slice(0, 4).map((cap: string, i: number) => (
                <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">{cap}</span>
              ))}
              {connector.capabilities.length > 4 && (
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>+{connector.capabilities.length - 4}</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <span className={`text-xs ${connector.healthCheck === 'healthy' ? 'text-green-500' : 'text-red-500'}`}>
                {connector.healthCheck === 'healthy' ? '✓ سالم' : '✗ ناسالم'}
              </span>
              <button className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600">
                <RefreshCw size={12} />
                تست اتصال
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
