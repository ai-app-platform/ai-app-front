import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { agentsApi } from '../../services/api';
import { ArrowRight, Bot, Cpu, Brain, Zap, Settings, Shield } from 'lucide-react';
import { Badge } from '../../components/ui/FormComponents';

export default function AgentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      agentsApi.getDetail(id).then(res => { setAgent(res.data); setLoading(false); });
    }
  }, [id]);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div></div>;
  if (!agent) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>Agent یافت نشد</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/agents')} className="hover:text-indigo-500">Agentها</button>
        <ArrowRight size={14} />
        <span style={{ color: 'var(--text-primary)' }}>{agent.name}</span>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
          <Bot size={32} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{agent.name}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{agent.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={agent.status === 'available' ? 'success' : agent.status === 'busy' ? 'warning' : 'default'}>
              {agent.status === 'available' ? 'در دسترس' : agent.status === 'busy' ? 'مشغول' : 'بیکار'}
            </Badge>
            <Badge variant="info">v{agent.version}</Badge>
            <Badge variant="default">{agent.model}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{agent.stats?.totalTasks || 0}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>کل تسک‌ها</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-2xl font-bold text-green-500">{agent.stats?.successRate || 0}%</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>نرخ موفقیت</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{agent.stats?.avgDuration || '-'}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>میانگین مدت</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Settings size={18} className="text-indigo-500" />
            تنظیمات مدل
          </h2>
          <div className="space-y-3">
            {Object.entries(agent.configuration || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm capitalize" style={{ color: 'var(--text-muted)' }}>{key}</span>
                <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Shield size={18} className="text-green-500" />
            سیاست اجرا
          </h2>
          <div className="space-y-3">
            {Object.entries(agent.executionPolicy || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{key === 'maxRetries' ? 'حداکثر تلاش مجدد' : key === 'timeout' ? 'تایم‌اوت (ثانیه)' : key === 'approvalRequired' ? 'نیاز به تأیید' : key}</span>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>مهارت‌ها</h2>
        <div className="flex flex-wrap gap-2">
          {agent.skills?.map((skill: string, i: number) => (
            <span key={i} className="text-sm px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">{skill}</span>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>ابزارهای مجاز</h2>
        <div className="flex flex-wrap gap-2">
          {agent.allowedTools?.map((tool: string, i: number) => (
            <span key={i} className="text-xs px-2 py-1 rounded font-mono" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{tool}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
