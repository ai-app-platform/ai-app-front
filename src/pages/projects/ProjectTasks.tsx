import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { tasksApi } from '../../services/api';
import { ListTodo, Plus, Clock, CheckCircle2, Play, XCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '../../components/ui/FormComponents';

export default function ProjectTasks() {
  const { project } = useOutletContext<{ project: any }>();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (project?.id) {
      tasksApi.getAll(project.id).then(res => { setTasks(res.data); setLoading(false); });
    }
  }, [project?.id]);

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

  if (loading) return <div className="animate-pulse space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>تسک‌های پروژه</h2>
        <Link to={`/projects/${project?.id}/tasks/new`} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
          <Plus size={14} />
          تسک جدید
        </Link>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <ListTodo size={48} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }}>هنوز تسکی ایجاد نشده است</p>
          </div>
        ) : (
          tasks.map(task => {
            const status = getStatusConfig(task.status);
            return (
              <Link
                key={task.id}
                to={`/tasks/${task.id}`}
                className="block p-4 rounded-xl transition-all hover:shadow-md cursor-pointer"
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
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
