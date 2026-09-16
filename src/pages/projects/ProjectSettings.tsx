import { useOutletContext } from 'react-router-dom';
import { Settings, FolderGit2, Bot, Workflow, Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui/FormComponents';

export default function ProjectSettings() {
  const { project } = useOutletContext<{ project: any }>();

  if (!project) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>تنظیمات پروژه</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h3 className="text-md font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Settings size={18} className="text-indigo-500" />
            تنظیمات عمومی
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>نام پروژه</span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{project.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>زبان</span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{project.language}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>وضعیت</span>
              <Badge variant={project.status === 'active' ? 'success' : 'warning'}>
                {project.status === 'active' ? 'فعال' : 'متوقف'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Git Settings */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h3 className="text-md font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FolderGit2 size={18} className="text-purple-500" />
            تنظیمات Git
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Repository</span>
              <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{project.gitUrl}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Connector</span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{project.connector}</span>
            </div>
          </div>
        </div>

        {/* Agent Settings */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h3 className="text-md font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Bot size={18} className="text-blue-500" />
            تنظیمات Agent
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>تعداد Agentها</span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{project.stats?.activeAgents || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>تیم</span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{project.teamId}</span>
            </div>
          </div>
        </div>

        {/* Workflow Settings */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h3 className="text-md font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Workflow size={18} className="text-green-500" />
            تنظیمات Workflow
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Workflow پیش‌فرض</span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{project.defaultWorkflow}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl p-5 border-2 border-red-500/30" style={{ backgroundColor: 'var(--bg-card)' }}>
        <h3 className="text-md font-semibold mb-4 text-red-500 flex items-center gap-2">
          <Trash2 size={18} />
          منطقه خطر
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          این عملیات غیرقابل بازگشت است. پس از حذف، تمام اطلاعات پروژه از بین خواهد رفت.
        </p>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
          حذف پروژه
        </button>
      </div>
    </div>
  );
}
