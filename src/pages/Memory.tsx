import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memoryApi } from '../services/api';
import { Brain, Clock, CheckCircle2, AlertCircle, FileText, History, Lightbulb, Eye } from 'lucide-react';
import { Badge, Tabs } from '../components/ui/FormComponents';
import Modal from '../components/ui/Modal';

export default function Memory() {
  const navigate = useNavigate();
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    memoryApi.getProjectMemory('p1').then(res => {
      setMemories(res.data);
      setLoading(false);
    });
  }, []);

  const filteredMemories = activeTab === 'all' 
    ? memories 
    : memories.filter(m => m.type === activeTab);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task-state': return <Clock size={16} className="text-blue-500" />;
      case 'decision': return <Lightbulb size={16} className="text-amber-500" />;
      case 'discovery': return <FileText size={16} className="text-green-500" />;
      case 'execution-history': return <History size={16} className="text-purple-500" />;
      default: return <Brain size={16} className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'task-state': return 'وضعیت تسک';
      case 'decision': return 'تصمیم';
      case 'discovery': return 'یافته';
      case 'execution-history': return 'تاریخچه اجرا';
      default: return type;
    }
  };

  const handleViewDetail = (memory: any) => {
    setSelectedMemory(memory);
    setShowDetail(true);
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-24 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>حافظه</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Runtime Memory و تاریخچه اجرا</p>
      </div>

      {/* Memory Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Memory', value: '12', icon: Clock, color: 'text-blue-500' },
          { label: 'تصمیمات', value: '8', icon: Lightbulb, color: 'text-amber-500' },
          { label: 'یافته‌ها', value: '15', icon: FileText, color: 'text-green-500' },
          { label: 'تاریخچه', value: '45', icon: History, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <stat.icon size={20} className={stat.color} />
            <div className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { key: 'all', label: 'همه' },
          { key: 'task-state', label: 'وضعیت تسک' },
          { key: 'decision', label: 'تصمیمات' },
          { key: 'discovery', label: 'یافته‌ها' },
          { key: 'execution-history', label: 'تاریخچه' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Memory Items */}
      <div className="space-y-3">
        {filteredMemories.map(memory => (
          <div
            key={memory.id}
            className="p-4 rounded-xl transition-all hover:shadow-md cursor-pointer"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            onClick={() => handleViewDetail(memory)}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                {getTypeIcon(memory.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                    {getTypeLabel(memory.type)}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{memory.timestamp}</span>
                  {memory.promoted && (
                    <Badge variant="success">
                      <CheckCircle2 size={10} className="ml-1" />
                      Promoted
                    </Badge>
                  )}
                  {memory.ragIndexed && (
                    <Badge variant="info">
                      <FileText size={10} className="ml-1" />
                      RAG
                    </Badge>
                  )}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{memory.content}</p>
                <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>پروژه: {memory.projectId}</span>
                  <span>تسک: {memory.taskId}</span>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ color: 'var(--text-muted)' }}>
                <Eye size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="جزئیات حافظه" size="lg">
        {selectedMemory && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {getTypeIcon(selectedMemory.type)}
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {getTypeLabel(selectedMemory.type)}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{selectedMemory.timestamp}</span>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{selectedMemory.content}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>پروژه</div>
                <div className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{selectedMemory.projectId}</div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>تسک</div>
                <div className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{selectedMemory.taskId}</div>
              </div>
            </div>

            {selectedMemory.metadata && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Metadata</div>
                <pre className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {JSON.stringify(selectedMemory.metadata, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {selectedMemory.promoted ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <AlertCircle size={16} className="text-gray-400" />
                )}
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  Promoted به Long-Term Memory
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedMemory.ragIndexed ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <AlertCircle size={16} className="text-gray-400" />
                )}
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  ایندکس شده در RAG
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
