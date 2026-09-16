import { useEffect, useState } from 'react';
import { skillsApi } from '../services/api';
import { Zap, Code2, Database, Shield, TestTube, Wrench } from 'lucide-react';

export default function Skills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillsApi.getAll().then(res => { setSkills(res.data); setLoading(false); });
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'language': return <Code2 size={16} className="text-blue-500" />;
      case 'framework': return <Zap size={16} className="text-purple-500" />;
      case 'database': return <Database size={16} className="text-green-500" />;
      case 'security': return <Shield size={16} className="text-red-500" />;
      case 'testing': return <TestTube size={16} className="text-amber-500" />;
      case 'devops': return <Wrench size={16} className="text-cyan-500" />;
      default: return <Zap size={16} className="text-gray-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'advanced': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'intermediate': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-32 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>مهارت‌ها</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>مهارت‌ها و تخصص‌های قابل استفاده</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(skill => (
          <div key={skill.id} className="p-4 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                {getCategoryIcon(skill.category)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{skill.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(skill.level)}`}>{skill.level}</span>
              </div>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{skill.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
