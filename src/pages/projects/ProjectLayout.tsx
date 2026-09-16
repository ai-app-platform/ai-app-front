import { useEffect, useState } from 'react';
import { useParams, Link, useLocation, Outlet } from 'react-router-dom';
import { projectsApi } from '../../services/api';
import { FolderGit2, ListTodo, GitBranch, Layers, Users, Settings, ArrowRight, Bot } from 'lucide-react';
import { Badge } from '../../components/ui/FormComponents';

export default function ProjectLayout() {
  const { id } = useParams();
  const location = useLocation();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      projectsApi.getDetail(id).then(res => { setProject(res.data); setLoading(false); });
    }
  }, [id]);

  const tabs = [
    { key: '', label: 'نمای کلی', icon: FolderGit2, path: `/projects/${id}` },
    { key: 'tasks', label: 'تسک‌ها', icon: ListTodo, path: `/projects/${id}/tasks` },
    { key: 'git', label: 'Git', icon: GitBranch, path: `/projects/${id}/git` },
    { key: 'workspace', label: 'Workspace', icon: Layers, path: `/projects/${id}/workspace` },
    { key: 'team', label: 'تیم', icon: Users, path: `/projects/${id}/team` },
    { key: 'settings', label: 'تنظیمات', icon: Settings, path: `/projects/${id}/settings` },
  ];

  const isActive = (path: string) => {
    if (path === `/projects/${id}`) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div></div>;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <Link to="/projects" className="hover:text-indigo-500">پروژه‌ها</Link>
        <ArrowRight size={14} />
        <span style={{ color: 'var(--text-primary)' }}>{project?.name}</span>
      </div>

      {/* Project Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
          <FolderGit2 size={28} className="text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{project?.name}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{project?.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={project?.status === 'active' ? 'success' : 'warning'}>
              {project?.status === 'active' ? 'فعال' : 'متوقف'}
            </Badge>
            <Badge variant="info">{project?.language}</Badge>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{project?.gitUrl}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        {tabs.map(tab => (
          <Link
            key={tab.key}
            to={tab.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              isActive(tab.path) ? 'bg-indigo-600 text-white' : ''
            }`}
            style={isActive(tab.path) ? {} : { color: 'var(--text-secondary)' }}
          >
            <tab.icon size={14} />
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div>
        <Outlet context={{ project }} />
      </div>
    </div>
  );
}
