import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { teamsApi, promptsApi, memoryApi, settingsApi, workspaceApi } from '../../services/api';
import { ArrowRight, Plus, Users, FileText, Brain, Database, Key, Server, HardDrive, Trash2, Eye, Terminal, FolderOpen, RefreshCw, Play, Pause, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { FormField, Input, Select, Button, Badge, Tabs } from '../../components/ui/FormComponents';
import Modal from '../../components/ui/Modal';

// ==================== TEAM DETAIL ====================
export function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) teamsApi.getDetail(id).then(res => { setTeam(res.data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;
  if (!team) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>تیم یافت نشد</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/teams')} className="hover:text-indigo-500">تیم‌ها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>{team.name}</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{team.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="info">v{team.version}</Badge>
          <Badge variant="default">{team.agents?.length || 0} Agent</Badge>
        </div>
      </div>
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>اعضای تیم</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {team.agents?.map((member: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className={`w-3 h-3 rounded-full ${member.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Agent {member.agentId}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>نقش: {member.role}</div>
              </div>
              <Badge variant={member.enabled ? 'success' : 'default'}>{member.enabled ? 'فعال' : 'غیرفعال'}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== TEAM CREATE ====================
export function TeamCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', projectId: 'p1', workflowId: 'w1' });
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const allAgents = [
    { id: 'a1', name: 'معمار سیستم' }, { id: 'a2', name: 'توسعه‌دهنده Backend' },
    { id: 'a3', name: 'توسعه‌دهنده Frontend' }, { id: 'a4', name: 'بازبین کد' },
    { id: 'a5', name: 'تست‌نویس' }, { id: 'a6', name: 'متخصص امنیت' },
  ];

  const toggleAgent = (id: string) => {
    setSelectedAgents(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await teamsApi.create({ ...formData, agents: selectedAgents.map(id => ({ agentId: id, role: 'developer', enabled: true })) });
    setSubmitting(false);
    navigate('/teams');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/teams')} className="hover:text-indigo-500">تیم‌ها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>ایجاد تیم جدید</span>
      </div>
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>ایجاد تیم جدید</h1>
        <div className="space-y-5">
          <FormField label="نام تیم" required><Input value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="نام تیم" /></FormField>
          <FormField label="پروژه">
            <Select value={formData.projectId} onChange={v => setFormData({ ...formData, projectId: v })} options={[
              { value: 'p1', label: 'پروژه فروشگاه آنلاین' }, { value: 'p2', label: 'پروژه API Gateway' },
            ]} />
          </FormField>
          <FormField label="اعضای تیم">
            <div className="space-y-2">
              {allAgents.map(agent => (
                <label key={agent.id} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-opacity-80" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <input type="checkbox" checked={selectedAgents.includes(agent.id)} onChange={() => toggleAgent(agent.id)} className="rounded" />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{agent.name}</span>
                </label>
              ))}
            </div>
          </FormField>
          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'در حال ایجاد...' : 'ایجاد تیم'}</Button>
            <Button variant="ghost" onClick={() => navigate('/teams')}>انصراف</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PROMPT DETAIL ====================
export function PromptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) promptsApi.getDetail(id).then(res => { setPrompt(res.data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;
  if (!prompt) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>Prompt یافت نشد</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/prompts')} className="hover:text-indigo-500">Promptها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>{prompt.name}</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{prompt.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="info">v{prompt.version}</Badge>
          <Badge variant={prompt.type === 'system' ? 'info' : 'default'}>{prompt.type === 'system' ? 'سیستمی' : 'تسک'}</Badge>
          <Badge variant="success">فعال</Badge>
        </div>
      </div>
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Template</h2>
        <pre className="text-sm whitespace-pre-wrap font-mono p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{prompt.template}</pre>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>متغیرها</h2>
          <div className="flex flex-wrap gap-2">
            {prompt.variables?.map((v: string, i: number) => (
              <span key={i} className="text-xs px-2 py-1 rounded font-mono" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{`{{${v}}}`}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>تنظیمات مدل</h2>
          <div className="space-y-2">
            {Object.entries(prompt.modelConfig || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{key}</span>
                <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {prompt.changeHistory && (
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>تاریخچه تغییرات</h2>
          <div className="space-y-3">
            {prompt.changeHistory.map((change: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <Badge variant="info">v{change.version}</Badge>
                <div className="flex-1"><p className="text-sm" style={{ color: 'var(--text-primary)' }}>{change.changes}</p><p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{change.date}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PROMPT CREATE ====================
export function PromptCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', template: '', type: 'system', model: 'GPT-4', temperature: '0.3', maxTokens: '8000' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await promptsApi.create({ ...formData, variables: [], modelConfig: { model: formData.model, temperature: parseFloat(formData.temperature), maxTokens: parseInt(formData.maxTokens) } });
    setSubmitting(false);
    navigate('/prompts');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/prompts')} className="hover:text-indigo-500">Promptها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>ایجاد Prompt جدید</span>
      </div>
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>ایجاد Prompt جدید</h1>
        <div className="space-y-5">
          <FormField label="نام" required><Input value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="نام Prompt" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="نوع">
              <Select value={formData.type} onChange={v => setFormData({ ...formData, type: v })} options={[
                { value: 'system', label: 'سیستمی' }, { value: 'task', label: 'تسک' },
              ]} />
            </FormField>
            <FormField label="مدل">
              <Select value={formData.model} onChange={v => setFormData({ ...formData, model: v })} options={[
                { value: 'GPT-4', label: 'GPT-4' }, { value: 'GPT-3.5', label: 'GPT-3.5' }, { value: 'Claude-3', label: 'Claude-3' },
              ]} />
            </FormField>
          </div>
          <FormField label="Template" required hint="از {{variable}} برای متغیرها استفاده کنید"><Input value={formData.template} onChange={v => setFormData({ ...formData, template: v })} multiline rows={10} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Temperature"><Input value={formData.temperature} onChange={v => setFormData({ ...formData, temperature: v })} type="number" /></FormField>
            <FormField label="حداکثر Token"><Input value={formData.maxTokens} onChange={v => setFormData({ ...formData, maxTokens: v })} type="number" /></FormField>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'در حال ایجاد...' : 'ایجاد Prompt'}</Button>
            <Button variant="ghost" onClick={() => navigate('/prompts')}>انصراف</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== MEMORY DETAIL ====================
export function MemoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) memoryApi.getDetail(id).then(res => { setMemory(res.data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;
  if (!memory) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>حافظه یافت نشد</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/memory')} className="hover:text-indigo-500">حافظه</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>جزئیات</span>
      </div>
      <div>
        <Badge variant="info">{memory.type === 'task-state' ? 'وضعیت تسک' : memory.type === 'decision' ? 'تصمیم' : memory.type === 'discovery' ? 'یافته' : 'تاریخچه'}</Badge>
        <span className="text-sm mr-2" style={{ color: 'var(--text-muted)' }}>{memory.timestamp}</span>
      </div>
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>محتوا</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{memory.content}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Metadata</h2>
          <div className="space-y-2">
            {Object.entries(memory.metadata || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{key}</span>
                <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>وضعیت</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Promoted به Long-Term</span>
              <Badge variant={memory.promoted ? 'success' : 'default'}>{memory.promoted ? 'بله' : 'خیر'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>ایندکس شده در RAG</span>
              <Badge variant={memory.ragIndexed ? 'success' : 'default'}>{memory.ragIndexed ? 'بله' : 'خیر'}</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== WORKSPACE DETAIL ====================
export function WorkspaceDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('files');

  useEffect(() => {
    if (name) {
      Promise.all([workspaceApi.getDetail(name), workspaceApi.getFiles(name, '/')]).then(([wsRes, filesRes]) => {
        setWorkspace(wsRes.data);
        setFiles(filesRes.data);
        setLoading(false);
      });
    }
  }, [name]);

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;
  if (!workspace) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>Workspace یافت نشد</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/workspace')} className="hover:text-indigo-500">Workspace</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>{workspace.name}</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{workspace.name}</h1>
          <p className="text-sm font-mono mt-1" style={{ color: 'var(--text-muted)' }}>{workspace.directory}</p>
        </div>
        <Badge variant={workspace.status === 'active' ? 'success' : workspace.status === 'building' ? 'warning' : 'default'}>
          {workspace.status === 'active' ? 'فعال' : workspace.status === 'building' ? 'در حال build' : 'متوقف'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{workspace.size}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>حجم</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{workspace.files}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>فایل</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-2xl font-bold text-green-500">{workspace.testResults?.passed}/{workspace.testResults?.total}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>تست‌ها</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{workspace.testResults?.coverage}%</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Coverage</div>
        </div>
      </div>

      <Tabs tabs={[{ key: 'files', label: 'فایل‌ها' }, { key: 'build', label: 'Build' }, { key: 'terminal', label: 'Terminal' }]} activeTab={activeTab} onChange={setActiveTab} />

      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        {activeTab === 'files' && (
          <div className="space-y-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-80 cursor-pointer" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-3">
                  {file.type === 'directory' ? <FolderOpen size={16} className="text-amber-500" /> : <FileText size={16} className="text-blue-500" />}
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{file.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>{file.size}</span><span>{file.modified}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'build' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>آخرین Build</span>
              <Badge variant="success">موفق</Badge>
            </div>
            <pre className="text-xs font-mono p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
{`[INFO] Compiling 342 source files...
[INFO] BUILD SUCCESS
[INFO] Total time: 12.345 s
[INFO] Tests run: 145, Failures: 3, Errors: 0`}
            </pre>
          </div>
        )}
        {activeTab === 'terminal' && (
          <div className="space-y-3">
            <div className="p-4 rounded-lg font-mono text-sm" style={{ backgroundColor: '#1a1a2e', color: '#00ff00' }}>
              <div>$ mvn clean install</div>
              <div className="mt-2 text-gray-400">Building project...</div>
              <div className="text-green-400">BUILD SUCCESS</div>
            </div>
            <div className="flex gap-2">
              <Input value="" onChange={() => {}} placeholder="دستور را وارد کنید..." />
              <Button><Terminal size={14} /></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== SETTINGS DATABASE ====================
export function SettingsDatabase() {
  const [db, setDb] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [backing, setBacking] = useState(false);

  useEffect(() => { settingsApi.getDatabase().then(res => { setDb(res.data); setLoading(false); }); }, []);

  const testConnection = async () => { setTesting(true); await settingsApi.testDatabase(); setTesting(false); };
  const backup = async () => { setBacking(true); await settingsApi.backupDatabase(); setBacking(false); };

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>پایگاه داده</h2>
        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={testing} variant="secondary" size="sm">{testing ? 'در حال تست...' : 'تست اتصال'}</Button>
          <Button onClick={backup} disabled={backing} size="sm">{backing ? 'در حال بکاپ...' : 'بکاپ‌گیری'}</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <Database size={20} className="text-indigo-500 mb-2" />
          <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{db?.type}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>v{db?.version}</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{db?.tables}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>جدول</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{db?.size}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>حجم</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <Badge variant="success">متصل</Badge>
          <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>آخرین بکاپ: {db?.lastBackup}</div>
        </div>
      </div>
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>اطلاعات اتصال</h3>
        <div className="space-y-3">
          <div className="flex justify-between"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>Host</span><span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{db?.host}:{db?.port}</span></div>
          <div className="flex justify-between"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>Database</span><span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{db?.name}</span></div>
        </div>
      </div>
    </div>
  );
}

// ==================== SETTINGS API KEYS ====================
export function SettingsApiKeys() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newKey, setNewKey] = useState({ name: '', provider: 'openai', key: '' });

  useEffect(() => { settingsApi.getApiKeys().then(res => { setApiKeys(res.data); setLoading(false); }); }, []);

  const handleCreate = async () => {
    await settingsApi.createApiKey(newKey);
    setApiKeys([...apiKeys, { id: 'key-new', ...newKey, status: 'active', lastUsed: 'همین الان', masked: 'sk-...new' }]);
    setShowCreate(false);
    setNewKey({ name: '', provider: 'openai', key: '' });
  };

  const handleDelete = async (id: string) => {
    await settingsApi.deleteApiKey(id);
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>API Keys</h2>
        <Button onClick={() => setShowCreate(true)} size="sm"><Plus size={14} className="inline ml-1" />کلید جدید</Button>
      </div>
      <div className="space-y-3">
        {apiKeys.map(key => (
          <div key={key.id} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <Key size={20} className="text-indigo-500" />
              <div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{key.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{key.masked}</span>
                  <Badge variant="success">فعال</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>آخرین استفاده: {key.lastUsed}</span>
              <button onClick={() => handleDelete(key.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="ایجاد API Key جدید">
        <div className="space-y-4">
          <FormField label="نام" required><Input value={newKey.name} onChange={v => setNewKey({ ...newKey, name: v })} placeholder="نام کلید" /></FormField>
          <FormField label="Provider" required>
            <Select value={newKey.provider} onChange={v => setNewKey({ ...newKey, provider: v })} options={[
              { value: 'openai', label: 'OpenAI' }, { value: 'anthropic', label: 'Anthropic' }, { value: 'github', label: 'GitHub' },
            ]} />
          </FormField>
          <FormField label="API Key" required><Input value={newKey.key} onChange={v => setNewKey({ ...newKey, key: v })} placeholder="sk-..." type="password" /></FormField>
          <div className="flex gap-2 pt-2"><Button onClick={handleCreate}>ذخیره</Button><Button variant="ghost" onClick={() => setShowCreate(false)}>انصراف</Button></div>
        </div>
      </Modal>
    </div>
  );
}

// ==================== SETTINGS INFRASTRUCTURE ====================
export function SettingsInfrastructure() {
  const [infra, setInfra] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { settingsApi.getInfrastructure().then(res => { setInfra(res.data); setLoading(false); }); }, []);

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;

  const services = [
    { key: 'langgraph', name: 'LangGraph Engine', icon: '🔄', data: infra?.langgraph },
    { key: 'rag', name: 'RAG (Qdrant)', icon: '🔍', data: infra?.rag },
    { key: 'codebase', name: 'Codebase Intelligence', icon: '📊', data: infra?.codebase },
    { key: 'contextEngine', name: 'Context Engine', icon: '🧠', data: infra?.contextEngine },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>زیرساخت</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <div key={service.key} className="p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{service.icon}</span>
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{service.name}</h3>
              </div>
              <Badge variant={service.data?.status === 'active' ? 'success' : 'error'}>{service.data?.status === 'active' ? 'فعال' : 'غیرفعال'}</Badge>
            </div>
            <div className="space-y-2">
              {service.data && Object.entries(service.data).filter(([k]) => k !== 'status').map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{key}</span>
                  <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
