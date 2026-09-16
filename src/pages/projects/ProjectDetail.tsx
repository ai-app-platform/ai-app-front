import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi } from '../../services/api';
import { ArrowRight, FolderGit2, Bot, ListTodo, GitBranch, Clock, CheckCircle2, Settings, Play, Pause } from 'lucide-react';
import { Badge } from '../../components/ui/FormComponents';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      projectsApi.getDetail(id).then(res => { setProject(res.data); setLoading(false); });
    }
  }, [id]);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div></div>;
  if (!project) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>پروژه یافت نشد</p></div>;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/projects')} className="hover:text-indigo-500">پروژه‌ها</button>
        <ArrowRight size={14} />
        <span style={{ color: 'var(--text-primary)' }}>{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <FolderGit2 size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{project.name}</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={project.status === 'active' ? 'success' : 'warning'}>
                {project.status === 'active' ? 'فعال' : 'متوقف'}
              </Badge>
              <Badge variant="info">{project.language}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
            <Settings size={14} className="inline ml-1" />
            تنظیمات
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'فایل‌ها', value: project.stats?.totalFiles || 0, icon: FolderGit2 },
          { label: 'خطوط کد', value: project.stats?.totalLines?.toLocaleString() || 0, icon: ListTodo },
          { label: 'تسک‌ها', value: project.stats?.totalTasks || 0, icon: ListTodo },
          { label: 'تکمیل‌شده', value: project.stats?.completedTasks || 0, icon: CheckCircle2 },
          { label: 'Agentها', value: project.stats?.activeAgents || 0, icon: Bot },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <stat.icon size={20} className="text-indigo-500 mb-2" />
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Info */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>اطلاعات پروژه</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Git Repository</span>
              <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{project.gitUrl}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Workspace</span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{project.workspace}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>تاریخ ایجاد</span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{project.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>آخرین به‌روزرسانی</span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{project.updatedAt}</span>
            </div>
          </div>
        </div>

        {/* Environment */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>محیط اجرا</h2>
          <div className="space-y-3">
            {Object.entries(project.environment || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm capitalize" style={{ color: 'var(--text-muted)' }}>{key}</span>
                <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{value as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Commits */}
      {project.recentCommits?.length > 0 && (
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <GitBranch size={18} className="text-indigo-500" />
            Commitهای اخیر
          </h2>
          <div className="space-y-2">
            {project.recentCommits.map((commit: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{commit.sha}</span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{commit.message}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>{commit.author}</span>
                  <span>•</span>
                  <span>{commit.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>اقدامات سریع</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={() => navigate('/tasks')} className="p-4 rounded-lg text-center hover:scale-[1.02] transition-transform" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <ListTodo size={24} className="text-blue-500 mx-auto mb-2" />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>تسک جدید</span>
          </button>
          <button onClick={() => navigate('/git')} className="p-4 rounded-lg text-center hover:scale-[1.02] transition-transform" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <GitBranch size={24} className="text-purple-500 mx-auto mb-2" />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>مدیریت Git</span>
          </button>
          <button onClick={() => navigate('/workspace')} className="p-4 rounded-lg text-center hover:scale-[1.02] transition-transform" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <FolderGit2 size={24} className="text-green-500 mx-auto mb-2" />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Workspace</span>
          </button>
          <button onClick={() => navigate('/teams')} className="p-4 rounded-lg text-center hover:scale-[1.02] transition-transform" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <Bot size={24} className="text-amber-500 mx-auto mb-2" />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>تیم</span>
          </button>
        </div>
      </div>
    </div>
  );
}
