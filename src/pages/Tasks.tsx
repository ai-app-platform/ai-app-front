import { useEffect, useState } from 'react';
import { tasksApi, projectsApi } from '../services/api';
import { ListTodo, Plus, Filter, Clock, CheckCircle2, Play, XCircle, AlertTriangle } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([tasksApi.getAll(), projectsApi.getAll()]).then(([tasksRes, projectsRes]) => {
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': return { label: 'تکمیل‌شده', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' };
      case 'running': return { label: 'در حال اجرا', icon: Play, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' };
      case 'pending': return { label: 'در انتظار', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' };
      case 'failed': return { label: 'ناموفق', icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' };
      default: return { label: status, icon: AlertTriangle, color: 'text-gray-500', bg: 'bg-gray-100' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getProjectName = (projectId: string) => projects.find(p => p.id === projectId)?.name || 'نامشخص';

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-full rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>تسک‌ها</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>مدیریت و پیگیری تسک‌ها</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
          <Plus size={16} />
          تسک جدید
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={16} style={{ color: 'var(--text-muted)' }} />
        {[
          { key: 'all', label: 'همه' },
          { key: 'running', label: 'در حال اجرا' },
          { key: 'pending', label: 'در انتظار' },
          { key: 'completed', label: 'تکمیل‌شده' },
          { key: 'failed', label: 'ناموفق' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.key
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-opacity-80'
            }`}
            style={filter !== f.key ? { backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' } : {}}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filtered.map(task => {
          const status = getStatusConfig(task.status);
          return (
            <div
              key={task.id}
              className="p-4 rounded-xl transition-all hover:shadow-md cursor-pointer"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-1 h-full min-h-[40px] rounded-full ${getPriorityColor(task.priority)}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{task.title}</h3>
                      <status.icon size={14} className={status.color} />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {getProjectName(task.projectId)}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Workflow: {task.workflow}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{task.createdAt}</div>
                  {task.completedAt && (
                    <div className="text-xs text-green-500 mt-1">{task.completedAt}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
