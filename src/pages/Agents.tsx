import { useEffect, useState } from 'react';
import { agentsApi } from '../services/api';
import { Bot, Plus, Search, Cpu, Brain, Zap, Settings } from 'lucide-react';

export default function Agents() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentsApi.getAll().then(res => { setAgents(res.data); setLoading(false); });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-amber-500';
      case 'idle': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'در دسترس';
      case 'busy': return 'مشغول';
      case 'idle': return 'بیکار';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'architect': return <Brain size={20} className="text-purple-400" />;
      case 'developer': return <Cpu size={20} className="text-blue-400" />;
      case 'reviewer': return <Search size={20} className="text-green-400" />;
      case 'tester': return <Zap size={20} className="text-amber-400" />;
      case 'security': return <Settings size={20} className="text-red-400" />;
      case 'planner': return <Brain size={20} className="text-cyan-400" />;
      default: return <Bot size={20} className="text-gray-400" />;
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-full rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-40 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Agentها</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>مدیریت Agentهای پلتفرم</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
          <Plus size={16} />
          Agent جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map(agent => (
          <div
            key={agent.id}
            className="p-5 rounded-xl transition-all hover:shadow-md cursor-pointer"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative">
                  {getTypeIcon(agent.type)}
                  <div className={`absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 rounded-full border-2 ${getStatusColor(agent.status)}`}
                    style={{ borderColor: 'var(--bg-card)' }}></div>
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{agent.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {getStatusLabel(agent.status)}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>v{agent.version}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{agent.description}</p>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                مدل: {agent.model}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {agent.skills.map((skill: string, i: number) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
