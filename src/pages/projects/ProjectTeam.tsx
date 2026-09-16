import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { teamsApi, agentsApi } from '../../services/api';
import { Users, Bot, Plus, Check, X } from 'lucide-react';
import { Badge } from '../../components/ui/FormComponents';

export default function ProjectTeam() {
  const { project } = useOutletContext<{ project: any }>();
  const [team, setTeam] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (project?.id) {
      Promise.all([
        teamsApi.getProjectTeam(project.id),
        agentsApi.getAll(),
      ]).then(([teamRes, agentsRes]) => {
        setTeam(teamRes.data);
        setAgents(agentsRes.data);
        setLoading(false);
      });
    }
  }, [project?.id]);

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;

  const getAgentName = (agentId: string) => agents.find(a => a.id === agentId)?.name || agentId;
  const getAgentType = (agentId: string) => agents.find(a => a.id === agentId)?.type || '';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>تیم پروژه</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{team?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info">v{team?.version}</Badge>
          <Link to={`/projects/${project?.id}/team/manage`} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
            <Plus size={14} />
            مدیریت تیم
          </Link>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-md font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>اعضای تیم ({team?.agents?.length || 0})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {team?.agents?.map((member: any, i: number) => (
            <Link
              key={i}
              to={`/agents/${member.agentId}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:shadow-md transition-all"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <Bot size={18} className="text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{getAgentName(member.agentId)}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>نقش: {member.role}</div>
              </div>
              <div className="flex items-center gap-1">
                {member.enabled ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <X size={14} className="text-gray-400" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-md font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>اطلاعات تیم</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>تاریخ ایجاد</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{team?.createdAt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>آخرین تغییر</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{team?.lastModified}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Workflow پیش‌فرض</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{team?.workflow}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
