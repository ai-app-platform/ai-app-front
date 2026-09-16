import { useOutletContext } from 'react-router-dom';
import { Bot, ListTodo, GitBranch, FolderGit2, CheckCircle2 } from 'lucide-react';

export default function ProjectOverview() {
  const { project } = useOutletContext<{ project: any }>();

  if (!project) return null;

  return (
    <div className="space-y-6">
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
    </div>
  );
}
