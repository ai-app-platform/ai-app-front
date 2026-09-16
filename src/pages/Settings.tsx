import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Settings, Palette, Globe, Bell, Shield, Database, Key, Server } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { key: 'general', label: 'عمومی', icon: Settings },
    { key: 'appearance', label: 'ظاهر', icon: Palette },
    { key: 'language', label: 'زبان', icon: Globe },
    { key: 'notifications', label: 'اعلان‌ها', icon: Bell },
    { key: 'security', label: 'امنیت', icon: Shield },
    { key: 'database', label: 'پایگاه داده', icon: Database },
    { key: 'api', label: 'API Keys', icon: Key },
    { key: 'infrastructure', label: 'زیرساخت', icon: Server },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>تنظیمات</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>تنظیمات پلتفرم و ترجیحات کاربری</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="space-y-1">
            {sections.map(section => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-right text-sm transition-all ${
                  activeSection === section.key
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-opacity-80'
                }`}
                style={activeSection !== section.key ? { color: 'var(--text-secondary)' } : {}}
              >
                <section.icon size={16} />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          {activeSection === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>تنظیمات عمومی</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>نام پلتفرم</label>
                  <input type="text" defaultValue="AI App Platform" className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>زبان پیش‌فرض مدل</label>
                  <select className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                    <option>GPT-4</option>
                    <option>Claude-3</option>
                    <option>GPT-3.5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>حداکثر Token</label>
                  <input type="number" defaultValue="32000" className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>تنظیمات ظاهر</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>حالت تاریک</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>تغییر بین حالت روشن و تاریک</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>تنظیمات امنیت</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>احراز هویت دو مرحله‌ای</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>افزایش امنیت حساب کاربری</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 text-white">فعال‌سازی</button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Secret Management</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>مدیریت Credential و Secretها</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>مدیریت</button>
                </div>
              </div>
            </div>
          )}

          {(activeSection !== 'general' && activeSection !== 'appearance' && activeSection !== 'security') && (
            <div className="flex flex-col items-center justify-center py-12">
              <Settings size={48} style={{ color: 'var(--text-muted)' }} />
              <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>این بخش به‌زودی فعال می‌شود</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
