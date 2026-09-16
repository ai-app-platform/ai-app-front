import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tasksApi } from '../../services/api';
import { ArrowRight, ListTodo, Bot, GitBranch, CheckCircle2, Clock, Play, XCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '../../components/ui/FormComponents';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      tasksApi.getDetail(id).then(res => { setTask(res.data); setLoading(false); });
    }
  }, [id]);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div></div>;
  if (!task) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>تسک یافت نشد</p></div>;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'running': return <Play size={16} className="text-blue-500" />;
      case 'pending': return <Clock size={16} className="text-amber-500" />;
      case 'failed': return <XCircle size={16} className="text-red-500" />;
      default: return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/tasks')} className="hover:text-indigo-500">تسک‌ها</button>
        <ArrowRight size={14} />
        <span style={{ color: 'var(--text-primary)' }}>{task.title}</span>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <ListTodo size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{task.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={task.status === 'completed' ? 'success' : task.status === 'running' ? 'info' : task.status === 'failed' ? 'error' : 'warning'}>
                {getStatusIcon(task.status)}
                <span className="mr-1">{task.status === 'completed' ? 'تکمیل‌شده' : task.status === 'running' ? 'در حال اجرا' : task.status === 'failed' ? 'ناموفق' : 'در انتظار'}</span>
              </Badge>
              <Badge variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'}>
                {task.priority === 'high' ? 'اولویت بالا' : task.priority === 'medium' ? 'اولویت متوسط' : 'اولویت پایین'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>توضیحات</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{task.description}</p>
      </div>

      {task.requirements && (
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>الزامات</h2>
          <ul className="space-y-2">
            {task.requirements.map((req: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="text-indigo-500 mt-0.5">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {task.executionSteps && (
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>مراحل اجرا</h2>
          <div className="space-y-3">
            {task.executionSteps.map((step: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  step.status === 'running' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{step.step}</span>
                    <Badge variant={step.status === 'completed' ? 'success' : step.status === 'running' ? 'info' : 'default'}>
                      {step.status === 'completed' ? 'تکمیل' : step.status === 'running' ? 'در حال اجرا' : 'در انتظار'}
                    </Badge>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{step.output}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {task.gitInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <GitBranch size={18} className="text-indigo-500" />
              اطلاعات Git
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Branch</span>
                <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{task.gitInfo.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Commits</span>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{task.gitInfo.commits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>فایل‌های تغییر یافته</span>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{task.gitInfo.filesChanged}</span>
              </div>
            </div>
          </div>

          {task.validation && (
            <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>اعتبارسنجی</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Build</span>
                  {task.validation.buildPassed !== null && (
                    <Badge variant={task.validation.buildPassed ? 'success' : 'error'}>
                      {task.validation.buildPassed ? 'موفق' : 'ناموفق'}
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>تست‌ها</span>
                  {task.validation.testsPassed !== null && (
                    <Badge variant={task.validation.testsPassed ? 'success' : 'error'}>
                      {task.validation.testsPassed ? 'موفق' : 'ناموفق'}
                    </Badge>
                  )}
                </div>
                {task.validation.codeQuality && (
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>کیفیت کد</span>
                    <span className="text-sm font-bold text-green-500">{task.validation.codeQuality}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
