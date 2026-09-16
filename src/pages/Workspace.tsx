import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, FolderOpen, Terminal, RefreshCw, Play, Pause, HardDrive, Cpu, MemoryStick } from 'lucide-react';

export default function Workspace() {
  const [activeProject] = useState('پروژه فروشگاه آنلاین');

  const workspaces = [
    { name: 'shop-api-workspace', status: 'active', size: '2.3 GB', lastSync: '۵ دقیقه پیش', files: 342 },
    { name: 'api-gateway-workspace', status: 'active', size: '1.1 GB', lastSync: '۱ ساعت پیش', files: 156 },
    { name: 'mobile-app-workspace', status: 'building', size: '890 MB', lastSync: '۲ ساعت پیش', files: 234 },
    { name: 'data-mining-workspace', status: 'idle', size: '450 MB', lastSync: '۱ روز پیش', files: 89 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Workspace</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>محیط Runtime پروژه‌ها</p>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-3">
            <HardDrive size={20} className="text-blue-500" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>فضای دیسک</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div className="h-full rounded-full bg-blue-500" style={{ width: '45%' }}></div>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>4.7 GB از 10 GB استفاده شده</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-3">
            <Cpu size={20} className="text-green-500" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>CPU</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div className="h-full rounded-full bg-green-500" style={{ width: '28%' }}></div>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>28% استفاده</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-3">
            <MemoryStick size={20} className="text-purple-500" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>حافظه</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div className="h-full rounded-full bg-purple-500" style={{ width: '62%' }}></div>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>6.2 GB از 10 GB استفاده شده</div>
        </div>
      </div>

      {/* Workspaces */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Layers size={18} className="text-indigo-500" />
          Workspaceها
        </h2>
        <div className="space-y-3">
          {workspaces.map((ws, i) => (
            <Link key={i} to={`/workspace/${ws.name}`} className="flex items-center justify-between p-4 rounded-lg hover:scale-[1.01] transition-transform" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  ws.status === 'active' ? 'bg-green-500 animate-pulse' :
                  ws.status === 'building' ? 'bg-amber-500 animate-pulse' :
                  'bg-gray-400'
                }`}></div>
                <div>
                  <h3 className="font-mono text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ws.name}</h3>
                  <div className="flex items-center gap-3 text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    <span>{ws.size}</span>
                    <span>{ws.files} فایل</span>
                    <span>آخرین sync: {ws.lastSync}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-opacity-80" style={{ color: 'var(--text-muted)' }}><Terminal size={14} /></button>
                <button className="p-1.5 rounded-lg hover:bg-opacity-80" style={{ color: 'var(--text-muted)' }}><FolderOpen size={14} /></button>
                <button className="p-1.5 rounded-lg hover:bg-opacity-80" style={{ color: 'var(--text-muted)' }}><RefreshCw size={14} /></button>
                {ws.status === 'active' ? (
                  <button className="p-1.5 rounded-lg text-amber-500"><Pause size={14} /></button>
                ) : (
                  <button className="p-1.5 rounded-lg text-green-500"><Play size={14} /></button>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
