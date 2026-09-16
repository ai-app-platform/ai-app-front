import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Settings, Palette, Globe, Bell, Shield, Database, Key, Server } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
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
                onClick={() => {
                  if (section.key === 'database') navigate('/settings/database');
                  else if (section.key === 'api') navigate('/settings/api-keys');
                  else if (section.key === 'infrastructure') navigate('/settings/infrastructure');
                  else setActiveSection(section.key);
                }}
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

          {activeSection === 'language' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>تنظیمات زبان</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>زبان رابط کاربری</label>
                  <select className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                    <option value="fa">فارسی</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>زبان پیش‌فرض Agentها</label>
                  <select className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                    <option value="fa">فارسی</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>فرمت تاریخ</label>
                  <select className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                    <option value="jalali">شمسی</option>
                    <option value="gregorian">میلادی</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>تنظیمات اعلان‌ها</h2>
              <div className="space-y-4">
                {[
                  { title: 'اعلان‌های ایمیلی', desc: 'دریافت اعلان‌ها از طریق ایمیل', defaultChecked: true },
                  { title: 'اعلان‌های Slack', desc: 'ارسال اعلان‌ها به Slack', defaultChecked: false },
                  { title: 'اعلان‌های تکمیل تسک', desc: 'اعلان پس از تکمیل هر تسک', defaultChecked: true },
                  { title: 'اعلان‌های خطا', desc: 'اعلان در صورت بروز خطا', defaultChecked: true },
                  { title: 'اعلان‌های امنیتی', desc: 'اعلان‌های مربوط به امنیت', defaultChecked: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
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
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Session Timeout</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>زمان انقضای نشست</p>
                  </div>
                  <select className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                    <option>30 دقیقه</option>
                    <option>1 ساعت</option>
                    <option>4 ساعت</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {(activeSection !== 'general' && activeSection !== 'appearance' && activeSection !== 'security' && activeSection !== 'language' && activeSection !== 'notifications') && (
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
