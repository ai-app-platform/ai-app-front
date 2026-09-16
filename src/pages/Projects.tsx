import { useEffect, useState } from 'react';
import { projectsApi } from '../services/api';
import { FolderGit2, Plus, Search, MoreVertical, Bot, ListTodo, Clock, CheckCircle2, AlertCircle, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    projectsApi.getAll().then(res => {
      setProjects(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = projects.filter(p => p.name.includes(searchTerm) || p.description.includes(searchTerm));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return { label: 'فعال', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 };
      case 'paused': return { label: 'متوقف', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Pause };
      case 'archived': return { label: 'آرشیو', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: AlertCircle };
      default: return { label: status, color: 'bg-gray-100 text-gray-700', icon: Clock };
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-full rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-48 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>پروژه‌ها</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>مدیریت پروژه‌های پلتفرم</p>
        </div>
        <Link to="/projects/new" className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
          <Plus size={16} />
          پروژه جدید
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="جستجو در پروژه‌ها..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/50"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(project => {
          const status = getStatusBadge(project.status);
          return (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group block p-5 rounded-xl transition-all hover:scale-[1.01] hover:shadow-lg"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <FolderGit2 size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{project.name}</h3>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{project.language}</span>
                  </div>
                </div>
                <button className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={16} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              <p className="text-xs mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                  <status.icon size={10} />
                  {status.label}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                  {project.workspace}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Bot size={12} /> {project.agents}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <ListTodo size={12} /> {project.tasks}
                  </span>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{project.lastActivity}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
