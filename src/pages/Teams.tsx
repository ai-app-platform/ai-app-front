import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { teamsApi, projectsApi, agentsApi } from '../services/api';
import { Users, Bot, Shield, ChevronDown, Check, X, Plus } from 'lucide-react';

export default function Teams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([projectsApi.getAll(), agentsApi.getAll()]).then(([projectsRes, agentsRes]) => {
      const mockTeams = [
        { id: 'team1', projectId: 'p1', name: 'تیم پروژه فروشگاه', version: '1.3.0', agentCount: 6 },
        { id: 'team2', projectId: 'p2', name: 'تیم پروژه API Gateway', version: '1.1.0', agentCount: 4 },
        { id: 'team3', projectId: 'p3', name: 'تیم پروژه موبایل', version: '1.0.0', agentCount: 3 },
      ];
      setTeams(mockTeams);
      setAgents(agentsRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-48 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>تیم‌ها</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>مدیریت تیم Agentهای پروژه‌ها</p>
        </div>
        <Link to="/teams/new" className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
          <Plus size={16} />
          تیم جدید
        </Link>
      </div>

      <div className="space-y-4">
        {teams.map(team => (
          <Link key={team.id} to={`/teams/${team.id}`} className="block p-5 rounded-xl hover:shadow-md transition-all" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{team.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>نسخه: {team.version}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>• {team.agentCount} Agent</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-600">
                <ChevronDown size={16} />
                مدیریت
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {agents.slice(0, team.agentCount).map((agent: any, i: number) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                    <Bot size={12} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{agent.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{agent.type}</p>
                  </div>
                  <Check size={12} className="text-green-500 shrink-0" />
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
