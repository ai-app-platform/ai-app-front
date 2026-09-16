import { useEffect, useState } from 'react';
import { contextApi } from '../services/api';
import { MessageSquare, Layers, Database, Brain, FileText, Wrench, Search, Zap, Eye, Info } from 'lucide-react';
import { Badge } from '../components/ui/FormComponents';
import Modal from '../components/ui/Modal';

export default function Context() {
  const [contextData, setContextData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [showSourceDetail, setShowSourceDetail] = useState(false);

  useEffect(() => {
    contextApi.getDetail('t1').then(res => {
      setContextData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div></div>;

  const sources = [
    { key: 'platformKnowledge', label: 'دانش پلتفرم', icon: Layers, color: 'text-purple-500', description: 'دانش عمومی پلتفرم شامل استانداردها و معماری' },
    { key: 'projectKnowledge', label: 'دانش پروژه', icon: FileText, color: 'text-blue-500', description: 'دانش مخصوص پروژه شامل قوانین دامنه و معماری پروژه' },
    { key: 'instructions', label: 'دستورالعمل‌ها', icon: Zap, color: 'text-amber-500', description: 'دستورالعمل‌های خاص برای Agentها' },
    { key: 'codeContext', label: 'Context کد', icon: Search, color: 'text-green-500', description: 'کد مرتبط با تسک جاری' },
    { key: 'memory', label: 'حافظه', icon: Brain, color: 'text-cyan-500', description: 'حافظه کوتاه‌مدت و بلندمدت' },
    { key: 'ragResults', label: 'نتایج RAG', icon: Database, color: 'text-indigo-500', description: 'نتایج بازیابی از RAG' },
    { key: 'toolDefinitions', label: 'تعریف ابزارها', icon: Wrench, color: 'text-rose-500', description: 'تعریف ابزارهای قابل استفاده' },
  ];

  const totalTokens = contextData?.totalTokens || 0;
  const maxTokens = contextData?.maxTokens || 32000;
  const usagePercent = (totalTokens / maxTokens) * 100;

  const handleViewSource = (source: any) => {
    setSelectedSource(source);
    setShowSourceDetail(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Context Engine</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>موتور جمع‌آوری و مونتاژ Context برای Agentها</p>
      </div>

      {/* Token Usage */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <MessageSquare size={18} className="text-indigo-500" />
            مصرف Token
          </h2>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {totalTokens.toLocaleString()} / {maxTokens.toLocaleString()}
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <div
            className={`h-full rounded-full transition-all ${usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
            style={{ width: `${usagePercent}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>استراتژی: {contextData?.retrievalStrategy}</span>
          <span>آخرین مونتاژ: {contextData?.assembledAt}</span>
        </div>
      </div>

      {/* Sources */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>منابع Context</h2>
          <span className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <Info size={12} className="inline ml-1" />
            برای مشاهده جزئیات روی هر منبع کلیک کنید
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sources.map(source => {
            const count = contextData?.sources?.[source.key] || 0;
            return (
              <div
                key={source.key}
                className="flex items-center gap-3 p-4 rounded-lg cursor-pointer hover:shadow-md transition-all"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                onClick={() => handleViewSource({ ...source, count, data: contextData?.sections?.find((s: any) => s.type === source.key) })}
              >
                <source.icon size={24} className={source.color} />
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{source.label}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{count} آیتم</div>
                </div>
                <button className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ color: 'var(--text-muted)' }}>
                  <Eye size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Retrieval Strategy */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>استراتژی بازیابی</h2>
        <div className="space-y-2">
          {[
            { level: 'Level 1', name: 'Canonical Local Context', desc: '.ai/knowledge, .ai/instructions, .ai/decisions', active: true },
            { level: 'Level 2', name: 'Current Codebase', desc: '.ai/codebase, Workspace, Local Code Search', active: true },
            { level: 'Level 3', name: 'Deep / Historical Retrieval', desc: 'RAG, Vector Search, Graph Search, Long-Term Memory', active: false },
          ].map((level, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${level.active ? '' : 'opacity-50'}`} style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${level.active ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-gray-100 text-gray-500'}`}>
                {level.level}
              </div>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{level.name}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{level.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Context Sections Detail */}
      {contextData?.sections && (
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>جزئیات بخش‌های Context</h2>
          <div className="space-y-3">
            {contextData.sections.map((section: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{section.type}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{section.source}</div>
                  </div>
                </div>
                <div className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {section.tokens.toLocaleString()} tokens
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source Detail Modal */}
      <Modal isOpen={showSourceDetail} onClose={() => setShowSourceDetail(false)} title="جزئیات منبع Context" size="lg">
        {selectedSource && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <selectedSource.icon size={32} className={selectedSource.color} />
              <div>
                <h3 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                  {selectedSource.label}
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {selectedSource.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>تعداد آیتم‌ها</div>
                <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selectedSource.count}
                </div>
              </div>
              {selectedSource.data && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>مصرف Token</div>
                  <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {selectedSource.data.tokens?.toLocaleString() || 0}
                  </div>
                </div>
              )}
            </div>

            {selectedSource.data && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  منبع
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {selectedSource.data.source}
                </p>
              </div>
            )}

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                توضیحات
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {selectedSource.description}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
