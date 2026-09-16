import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { rolesApi } from '../services/api';
import { Users, Shield, Eye, Code, TestTube, Brain, Lock, Plus } from 'lucide-react';

export default function Roles() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rolesApi.getAll().then(res => { setRoles(res.data); setLoading(false); });
  }, []);

  const getRoleIcon = (name: string) => {
    switch (name) {
      case 'معمار': return <Brain size={20} className="text-purple-500" />;
      case 'توسعه‌دهنده': return <Code size={20} className="text-blue-500" />;
      case 'بازبین': return <Eye size={20} className="text-green-500" />;
      case 'تست‌نویس': return <TestTube size={20} className="text-amber-500" />;
      case 'بازبین امنیتی': return <Lock size={20} className="text-red-500" />;
      case 'برنامه‌ریز': return <Shield size={20} className="text-cyan-500" />;
      default: return <Users size={20} className="text-gray-500" />;
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-40 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>نقش‌ها</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>تعریف نقش‌ها و مسئولیت‌ها</p>
        </div>
        <Link to="/roles/new" className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
          <Plus size={16} />
          نقش جدید
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(role => (
          <Link key={role.id} to={`/roles/${role.id}`} className="block p-5 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                {getRoleIcon(role.name)}
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{role.name}</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{role.description}</p>
              </div>
            </div>
            <div className="mb-3">
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>محدودیت‌ها:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {role.constraints.map((c: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>قابلیت‌ها:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {role.capabilities.map((c: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">{c}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
