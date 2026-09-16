import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../services/api';
import {
  FolderGit2, ListTodo, Bot, Wrench, Plug, TrendingUp,
  CheckCircle2, Clock, AlertCircle, Play, GitBranch, BookOpen,
  Hammer, ShieldCheck, ArrowUpLeft, ArrowDownRight, Zap, Search
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [statsRes, activitiesRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentActivities(),
      ]);
      setStats(statsRes.data);
      setActivities(activitiesRes.data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSkeleton />;

  const statCards = [
    { label: 'پروژه‌ها', value: stats.totalProjects, icon: FolderGit2, color: 'from-blue-500 to-blue-600', change: '+2' },
    { label: 'تسک‌های فعال', value: stats.activeTasks, icon: ListTodo, color: 'from-amber-500 to-orange-500', change: '+5' },
    { label: 'تسک‌های تکمیل‌شده', value: stats.completedTasks, icon: CheckCircle2, color: 'from-green-500 to-emerald-600', change: '+12' },
    { label: 'Agentها', value: stats.totalAgents, icon: Bot, color: 'from-purple-500 to-violet-600', change: '0' },
    { label: 'ابزارها', value: stats.totalTools, icon: Wrench, color: 'from-cyan-500 to-teal-600', change: '+3' },
    { label: 'اتصال‌دهنده‌ها', value: stats.totalConnectors, icon: Plug, color: 'from-rose-500 to-pink-600', change: '+1' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'agent_running': return <Play size={16} className="text-blue-500" />;
      case 'pr_created': return <GitBranch size={16} className="text-purple-500" />;
      case 'knowledge_updated': return <BookOpen size={16} className="text-amber-500" />;
      case 'build_success': return <Hammer size={16} className="text-cyan-500" />;
      case 'review_approved': return <ShieldCheck size={16} className="text-emerald-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>داشبورد</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>نمای کلی پلتفرم هوش مصنوعی</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>نرخ موفقیت: {stats.successRate}%</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <Clock size={16} className="text-blue-500" />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>میانگین اجرا: {stats.avgExecutionTime}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="p-4 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
              {stat.change !== '0' && (
                <span className={`text-xs flex items-center gap-0.5 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change.startsWith('+') ? <ArrowUpLeft size={10} /> : <ArrowDownRight size={10} />}
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Clock size={18} className="text-indigo-500" />
            فعالیت‌های اخیر
          </h2>
          <div className="space-y-3">
            {activities.map(activity => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-opacity-50"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {activity.project}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Zap size={18} className="text-amber-500" />
            دسترسی سریع
          </h2>
          <div className="space-y-2">
            {[
              { label: 'ایجاد تسک جدید', icon: ListTodo, color: 'text-blue-500', path: '/tasks/new' },
              { label: 'مدیریت Agentها', icon: Bot, color: 'text-purple-500', path: '/agents' },
              { label: 'بررسی Workspace', icon: FolderGit2, color: 'text-green-500', path: '/workspace' },
              { label: 'جستجو در RAG', icon: Search, color: 'text-cyan-500', path: '/rag' },
              { label: 'تنظیمات اتصال‌دهنده', icon: Plug, color: 'text-rose-500', path: '/connectors' },
              { label: 'مدیریت دانش', icon: BookOpen, color: 'text-amber-500', path: '/knowledge' },
            ].map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className="flex items-center gap-3 w-full p-3 rounded-lg text-right transition-all hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <action.icon size={18} className={action.color} />
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <AlertCircle size={18} className="text-green-500" />
          وضعیت سیستم
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'LangGraph Engine', status: 'active', latency: '12ms' },
            { name: 'RAG Index', status: 'active', latency: '45ms' },
            { name: 'Codebase Intelligence', status: 'active', latency: '23ms' },
            { name: 'Context Engine', status: 'active', latency: '8ms' },
          ].map((service, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{service.name}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{service.latency}</div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>
        <div className="h-80 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>
      </div>
    </div>
  );
}
