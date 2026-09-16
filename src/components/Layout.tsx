import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, FolderGit2, Bot, ListTodo, Wrench, Plug,
  BookOpen, Brain, Search, Code2, MessageSquare, FileText,
  Users, Workflow, Settings, Sun, Moon, Menu, X, ChevronDown,
  Layers, GitBranch, Zap
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigationGroups = [
  {
    label: 'داشبورد',
    items: [
      { name: 'نمای کلی', path: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'مدیریت پروژه',
    items: [
      { name: 'پروژه‌ها', path: '/projects', icon: FolderGit2 },
      { name: 'تسک‌ها', path: '/tasks', icon: ListTodo },
      { name: 'Git', path: '/git', icon: GitBranch },
      { name: 'Workspace', path: '/workspace', icon: Layers },
    ],
  },
  {
    label: 'هوش مصنوعی',
    items: [
      { name: 'Agentها', path: '/agents', icon: Bot },
      { name: 'تیم‌ها', path: '/teams', icon: Users },
      { name: 'نقش‌ها', path: '/roles', icon: Users },
      { name: 'مهارت‌ها', path: '/skills', icon: Zap },
      { name: 'Workflow', path: '/workflows', icon: Workflow },
    ],
  },
  {
    label: 'دانش و Context',
    items: [
      { name: 'دانش', path: '/knowledge', icon: BookOpen },
      { name: 'حافظه', path: '/memory', icon: Brain },
      { name: 'RAG', path: '/rag', icon: Search },
      { name: 'Codebase', path: '/codebase', icon: Code2 },
      { name: 'Context Engine', path: '/context', icon: MessageSquare },
    ],
  },
  {
    label: 'ابزارها و اتصال',
    items: [
      { name: 'ابزارها', path: '/tools', icon: Wrench },
      { name: 'اتصال‌دهنده‌ها', path: '/connectors', icon: Plug },
      { name: 'Promptها', path: '/prompts', icon: FileText },
    ],
  },
  {
    label: 'تنظیمات',
    items: [
      { name: 'تنظیمات', path: '/settings', icon: Settings },
    ],
  },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(navigationGroups.map(g => [g.label, true]))
  );
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-50 h-full transition-all duration-300 flex flex-col
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ backgroundColor: 'var(--bg-sidebar)', color: '#e2e8f0' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <span className="font-bold text-sm">AI Platform</span>
            </div>
          )}
          <button
            onClick={() => { setSidebarOpen(!sidebarOpen); setMobileMenuOpen(false); }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors hidden lg:block"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navigationGroups.map(group => (
            <div key={group.label} className="mb-2">
              {sidebarOpen && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <span>{group.label}</span>
                  <ChevronDown size={12} className={`transition-transform ${expandedGroups[group.label] ? '' : '-rotate-90'}`} />
                </button>
              )}
              {(expandedGroups[group.label] || !sidebarOpen) && (
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const isActive = location.pathname === item.path || 
                      (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                          ${isActive
                            ? 'bg-indigo-600/30 text-white border-r-2 border-indigo-400'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }
                          ${!sidebarOpen ? 'justify-center' : ''}
                        `}
                        title={!sidebarOpen ? item.name : undefined}
                      >
                        <item.icon size={18} className={isActive ? 'text-indigo-300' : ''} />
                        {sidebarOpen && <span className="text-sm">{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {sidebarOpen && <span className="text-sm">{theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header
          className="h-14 flex items-center justify-between px-4 border-b shrink-0"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              <Search size={14} />
              <span>جستجو...</span>
              <kbd className="px-1.5 py-0.5 rounded text-xs border" style={{ borderColor: 'var(--border-color)' }}>⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>آنلاین</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              م
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
