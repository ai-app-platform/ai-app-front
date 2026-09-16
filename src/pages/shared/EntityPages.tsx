import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connectorsApi, toolsApi, knowledgeApi, workflowsApi, rolesApi, skillsApi, teamsApi, promptsApi, memoryApi, settingsApi } from '../../services/api';
import { ArrowRight, Plus, Edit, Trash2, Eye, Copy, RefreshCw, Database, Key, Server, CheckCircle2, XCircle } from 'lucide-react';
import { FormField, Input, Select, Button, Badge, Tabs } from '../../components/ui/FormComponents';
import Modal from '../../components/ui/Modal';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useEffect } from 'react';

// ==================== CONNECTOR DETAIL ====================
export function ConnectorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [connector, setConnector] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (id) connectorsApi.getDetail(id).then(res => { setConnector(res.data); setLoading(false); });
  }, [id]);

  const testConnection = async () => {
    setTesting(true);
    await connectorsApi.testConnection(id!);
    setTesting(false);
  };

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;
  if (!connector) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>اتصال‌دهنده یافت نشد</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/connectors')} className="hover:text-indigo-500">اتصال‌دهنده‌ها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>{connector.name}</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{connector.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={connector.status === 'connected' ? 'success' : 'error'}>{connector.status === 'connected' ? 'متصل' : 'قطع'}</Badge>
            <Badge variant="info">{connector.provider}</Badge>
            <Badge variant="default">{connector.type}</Badge>
          </div>
        </div>
        <Button onClick={testConnection} disabled={testing}>{testing ? 'در حال تست...' : 'تست اتصال'}</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>اطلاعات اتصال</h2>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>Endpoint</span><span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{connector.endpoint}</span></div>
            <div className="flex justify-between"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>Repository</span><span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{connector.repository || '-'}</span></div>
            <div className="flex justify-between"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>Adapter</span><span className="text-sm" style={{ color: 'var(--text-primary)' }}>{connector.adapter}</span></div>
            <div className="flex justify-between"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>Credential Ref</span><span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{connector.credentialRef}</span></div>
          </div>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Health Check</h2>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>وضعیت</span><Badge variant={connector.healthCheck?.status === 'healthy' ? 'success' : 'error'}>{connector.healthCheck?.status === 'healthy' ? 'سالم' : 'ناسالم'}</Badge></div>
            <div className="flex justify-between"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>آخرین بررسی</span><span className="text-sm" style={{ color: 'var(--text-primary)' }}>{connector.healthCheck?.lastCheck}</span></div>
            <div className="flex justify-between"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>Latency</span><span className="text-sm" style={{ color: 'var(--text-primary)' }}>{connector.healthCheck?.latency}ms</span></div>
          </div>
        </div>
      </div>
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Capabilityها</h2>
        <div className="flex flex-wrap gap-2">
          {connector.capabilities?.map((cap: string, i: number) => (
            <span key={i} className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">{cap}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== CONNECTOR CREATE ====================
export function ConnectorCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', provider: 'github', type: 'git', endpoint: '', repository: '', adapter: 'rest' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => { setSubmitting(true); await connectorsApi.create(formData); setSubmitting(false); navigate('/connectors'); };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/connectors')} className="hover:text-indigo-500">اتصال‌دهنده‌ها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>ایجاد اتصال جدید</span>
      </div>
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>ایجاد اتصال‌دهنده جدید</h1>
        <div className="space-y-5">
          <FormField label="نام" required><Input value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="مثال: GitHub - پروژه اصلی" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Provider" required>
              <Select value={formData.provider} onChange={v => setFormData({ ...formData, provider: v })} options={[
                { value: 'github', label: 'GitHub' }, { value: 'gitlab', label: 'GitLab' }, { value: 'jira', label: 'Jira' }, { value: 'slack', label: 'Slack' }, { value: 'aws-s3', label: 'AWS S3' },
              ]} />
            </FormField>
            <FormField label="نوع" required>
              <Select value={formData.type} onChange={v => setFormData({ ...formData, type: v })} options={[
                { value: 'git', label: 'Git' }, { value: 'issue-tracker', label: 'Issue Tracker' }, { value: 'notification', label: 'Notification' }, { value: 'storage', label: 'Storage' },
              ]} />
            </FormField>
          </div>
          <FormField label="Endpoint" required><Input value={formData.endpoint} onChange={v => setFormData({ ...formData, endpoint: v })} placeholder="https://api.github.com" /></FormField>
          <FormField label="Repository"><Input value={formData.repository} onChange={v => setFormData({ ...formData, repository: v })} placeholder="organization/repository" /></FormField>
          <FormField label="Adapter" required>
            <Select value={formData.adapter} onChange={v => setFormData({ ...formData, adapter: v })} options={[
              { value: 'rest', label: 'REST' }, { value: 'sdk', label: 'SDK' }, { value: 'mcp', label: 'MCP' }, { value: 'native', label: 'Native' },
            ]} />
          </FormField>
          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'در حال ایجاد...' : 'ایجاد اتصال‌دهنده'}</Button>
            <Button variant="ghost" onClick={() => navigate('/connectors')}>انصراف</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== TOOL DETAIL ====================
export function ToolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) toolsApi.getDetail(id).then(res => { setTool(res.data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;
  if (!tool) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>ابزار یافت نشد</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/tools')} className="hover:text-indigo-500">ابزارها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>{tool.name}</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{tool.name}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{tool.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="success">فعال</Badge>
          <Badge variant="info">v{tool.version}</Badge>
          <Badge variant="default">{tool.type}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{tool.usageStats?.totalCalls?.toLocaleString() || 0}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>کل فراخوانی‌ها</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{tool.usageStats?.avgLatency || '-'}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>میانگین Latency</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-2xl font-bold text-green-500">{tool.usageStats?.successRate || 0}%</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>نرخ موفقیت</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Input Schema</h2>
          <pre className="text-xs font-mono p-3 rounded-lg overflow-auto" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{JSON.stringify(tool.inputSchema, null, 2)}</pre>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Output Schema</h2>
          <pre className="text-xs font-mono p-3 rounded-lg overflow-auto" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{JSON.stringify(tool.outputSchema, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

// ==================== TOOL CREATE ====================
export function ToolCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '', type: 'INTERNAL' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => { setSubmitting(true); await toolsApi.create(formData); setSubmitting(false); navigate('/tools'); };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/tools')} className="hover:text-indigo-500">ابزارها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>ایجاد ابزار جدید</span>
      </div>
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>ایجاد ابزار جدید</h1>
        <div className="space-y-5">
          <FormField label="نام ابزار" required hint="مثال: file.read, search_codebase"><Input value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="tool.name" /></FormField>
          <FormField label="توضیحات" required><Input value={formData.description} onChange={v => setFormData({ ...formData, description: v })} placeholder="توضیح ابزار" multiline rows={3} /></FormField>
          <FormField label="نوع" required>
            <Select value={formData.type} onChange={v => setFormData({ ...formData, type: v })} options={[
              { value: 'INTERNAL', label: 'Internal' }, { value: 'HTTP', label: 'HTTP' }, { value: 'MCP', label: 'MCP' },
            ]} />
          </FormField>
          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'در حال ایجاد...' : 'ایجاد ابزار'}</Button>
            <Button variant="ghost" onClick={() => navigate('/tools')}>انصراف</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== KNOWLEDGE DETAIL ====================
export function KnowledgeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [knowledge, setKnowledge] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) knowledgeApi.getDetail(id).then(res => { setKnowledge(res.data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;
  if (!knowledge) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>دانش یافت نشد</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/knowledge')} className="hover:text-indigo-500">دانش</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>{knowledge.title}</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{knowledge.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={knowledge.scope === 'platform' ? 'info' : 'warning'}>{knowledge.scope === 'platform' ? 'پلتفرم' : 'پروژه'}</Badge>
          <Badge variant="default">v{knowledge.version}</Badge>
          <Badge variant="success">فعال</Badge>
        </div>
      </div>
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>محتوا</h2>
        <pre className="text-sm whitespace-pre-wrap font-vazir p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{knowledge.content}</pre>
      </div>
      {knowledge.changeHistory && (
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>تاریخچه تغییرات</h2>
          <div className="space-y-3">
            {knowledge.changeHistory.map((change: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <Badge variant="info">v{change.version}</Badge>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{change.changes}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{change.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== KNOWLEDGE CREATE ====================
export function KnowledgeCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '', scope: 'platform', category: 'coding-standards' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => { setSubmitting(true); await knowledgeApi.create(formData); setSubmitting(false); navigate('/knowledge'); };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/knowledge')} className="hover:text-indigo-500">دانش</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>ایجاد دانش جدید</span>
      </div>
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>ایجاد دانش جدید</h1>
        <div className="space-y-5">
          <FormField label="عنوان" required><Input value={formData.title} onChange={v => setFormData({ ...formData, title: v })} placeholder="عنوان دانش" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Scope" required>
              <Select value={formData.scope} onChange={v => setFormData({ ...formData, scope: v })} options={[
                { value: 'platform', label: 'پلتفرم' }, { value: 'project', label: 'پروژه' },
              ]} />
            </FormField>
            <FormField label="دسته‌بندی" required>
              <Select value={formData.category} onChange={v => setFormData({ ...formData, category: v })} options={[
                { value: 'coding-standards', label: 'استاندارد کدنویسی' }, { value: 'architecture', label: 'معماری' },
                { value: 'security', label: 'امنیت' }, { value: 'testing', label: 'تست' },
              ]} />
            </FormField>
          </div>
          <FormField label="محتوا" required hint="از Markdown استفاده کنید"><Input value={formData.content} onChange={v => setFormData({ ...formData, content: v })} multiline rows={12} /></FormField>
          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'در حال ایجاد...' : 'ایجاد دانش'}</Button>
            <Button variant="ghost" onClick={() => navigate('/knowledge')}>انصراف</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== SORTABLE STEP COMPONENT ====================
function SortableStep({ step, index }: { step: any; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.name,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 rounded-lg cursor-move"
      {...attributes}
      {...listeners}
    >
      <GripVertical size={20} style={{ color: 'var(--text-muted)' }} className="cursor-grab" />
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
        {index + 1}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{step.name}</h3>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{step.description}</p>
      </div>
      <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>Timeout: {step.timeout}s</span>
    </div>
  );
}

function SortableSteps({ steps }: { steps: any[] }) {
  const [items, setItems] = useState(steps);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.name === active.id);
        const newIndex = items.findIndex((item) => item.name === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(item => item.name)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((step, i) => (
            <div key={step.name} className="rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <SortableStep step={step} index={i} />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

// ==================== WORKFLOW DETAIL ====================
export function WorkflowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) workflowsApi.getDetail(id).then(res => { setWorkflow(res.data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;
  if (!workflow) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>Workflow یافت نشد</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/workflows')} className="hover:text-indigo-500">Workflowها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>{workflow.name}</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{workflow.name}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{workflow.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="success">فعال</Badge>
          <Badge variant="info">v{workflow.version}</Badge>
        </div>
      </div>
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>مراحل Workflow</h2>
          <span className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            🖱️ Drag & Drop برای تغییر ترتیب
          </span>
        </div>
        <SortableSteps steps={workflow.stepDetails || []} />
      </div>
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>تنظیمات</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(workflow.configuration || {}).map(([key, value]: [string, any]) => (
            <div key={key} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{key}</div>
              <pre className="text-xs mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>{JSON.stringify(value, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== WORKFLOW CREATE ====================
export function WorkflowCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '', allowParallel: 'true' });
  const [selectedSteps, setSelectedSteps] = useState<string[]>(['planner', 'developer', 'reviewer']);
  const [submitting, setSubmitting] = useState(false);

  // لیست مراحل موجود
  const availableSteps = [
    { id: 'planner', name: 'برنامه‌ریز', description: 'تحلیل تسک و ایجاد Plan' },
    { id: 'architect', name: 'معمار', description: 'طراحی معماری سیستم' },
    { id: 'developer', name: 'توسعه‌دهنده', description: 'پیاده‌سازی کد' },
    { id: 'tester', name: 'تست‌نویس', description: 'نوشتن و اجرای تست' },
    { id: 'reviewer', name: 'بازبین', description: 'بازبینی کد' },
    { id: 'security-reviewer', name: 'بازبین امنیتی', description: 'بررسی امنیتی' },
    { id: 'qa', name: 'کنترل کیفیت', description: 'تست نهایی و QA' },
  ];

  const addStep = (stepId: string) => {
    if (!selectedSteps.includes(stepId)) {
      setSelectedSteps([...selectedSteps, stepId]);
    }
  };

  const removeStep = (index: number) => {
    setSelectedSteps(selectedSteps.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await workflowsApi.create({ ...formData, steps: selectedSteps });
    setSubmitting(false);
    navigate('/workflows');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/workflows')} className="hover:text-indigo-500">Workflowها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>ایجاد Workflow جدید</span>
      </div>
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>ایجاد Workflow جدید</h1>
        <div className="space-y-5">
          <FormField label="نام" required><Input value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="نام Workflow" /></FormField>
          <FormField label="توضیحات" required><Input value={formData.description} onChange={v => setFormData({ ...formData, description: v })} multiline rows={3} /></FormField>
          <FormField label="اجرای موازی">
            <Select value={formData.allowParallel} onChange={v => setFormData({ ...formData, allowParallel: v })} options={[
              { value: 'true', label: 'مجاز' }, { value: 'false', label: 'غیرمجاز' },
            ]} />
          </FormField>
          <FormField label="مراحل Workflow" hint="مراحل مورد نظر را از لیست زیر انتخاب کنید">
            <div className="space-y-3">
              {/* مراحل انتخاب شده */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>مراحل انتخاب شده ({selectedSteps.length})</label>
                {selectedSteps.map((stepId, i) => {
                  const step = availableSteps.find(s => s.id === stepId);
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{step?.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{step?.description}</div>
                      </div>
                      <button onClick={() => removeStep(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* مراحل موجود برای انتخاب */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>مراحل موجود</label>
                <div className="grid grid-cols-1 gap-2">
                  {availableSteps
                    .filter(step => !selectedSteps.includes(step.id))
                    .map(step => (
                      <button
                        key={step.id}
                        onClick={() => addStep(step.id)}
                        className="flex items-center gap-3 p-3 rounded-lg text-right hover:shadow-md transition-all"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                      >
                        <Plus size={16} className="text-indigo-500 shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{step.name}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{step.description}</div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </FormField>
          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'در حال ایجاد...' : 'ایجاد Workflow'}</Button>
            <Button variant="ghost" onClick={() => navigate('/workflows')}>انصراف</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== ROLE DETAIL ====================
export function RoleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) rolesApi.getDetail(id).then(res => { setRole(res.data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;
  if (!role) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>نقش یافت نشد</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/roles')} className="hover:text-indigo-500">نقش‌ها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>{role.name}</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{role.name}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{role.description}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>محدودیت‌ها</h2>
          <div className="space-y-2">
            {role.constraints?.map((c: string, i: number) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <XCircle size={14} className="text-red-500" /><span className="text-sm" style={{ color: 'var(--text-primary)' }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>قابلیت‌ها</h2>
          <div className="space-y-2">
            {role.capabilities?.map((c: string, i: number) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <CheckCircle2 size={14} className="text-green-500" /><span className="text-sm" style={{ color: 'var(--text-primary)' }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {role.allowedTools && (
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>ابزارهای مجاز</h2>
          <div className="flex flex-wrap gap-2">
            {role.allowedTools.map((t: string, i: number) => (
              <span key={i} className="text-xs px-2 py-1 rounded font-mono" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== ROLE CREATE ====================
export function RoleCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '', constraints: '', capabilities: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await rolesApi.create({
      ...formData,
      constraints: formData.constraints.split('\n').filter(c => c.trim()),
      capabilities: formData.capabilities.split('\n').filter(c => c.trim()),
    });
    setSubmitting(false);
    navigate('/roles');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/roles')} className="hover:text-indigo-500">نقش‌ها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>ایجاد نقش جدید</span>
      </div>
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>ایجاد نقش جدید</h1>
        <div className="space-y-5">
          <FormField label="نام نقش" required><Input value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="مثال: معمار" /></FormField>
          <FormField label="توضیحات" required><Input value={formData.description} onChange={v => setFormData({ ...formData, description: v })} multiline rows={3} /></FormField>
          <FormField label="محدودیت‌ها" hint="هر محدودیت در یک خط"><Input value={formData.constraints} onChange={v => setFormData({ ...formData, constraints: v })} multiline rows={4} /></FormField>
          <FormField label="قابلیت‌ها" hint="هر قابلیت در یک خط"><Input value={formData.capabilities} onChange={v => setFormData({ ...formData, capabilities: v })} multiline rows={4} /></FormField>
          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'در حال ایجاد...' : 'ایجاد نقش'}</Button>
            <Button variant="ghost" onClick={() => navigate('/roles')}>انصراف</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== SKILL DETAIL ====================
export function SkillDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) skillsApi.getDetail(id).then(res => { setSkill(res.data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;
  if (!skill) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>مهارت یافت نشد</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/skills')} className="hover:text-indigo-500">مهارت‌ها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>{skill.name}</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{skill.name}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{skill.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={skill.level === 'expert' ? 'info' : 'default'}>{skill.level}</Badge>
          <Badge variant="default">{skill.category}</Badge>
        </div>
      </div>
      {skill.subSkills && (
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>زیرمهارت‌ها</h2>
          <div className="flex flex-wrap gap-2">
            {skill.subSkills.map((s: string, i: number) => (
              <span key={i} className="text-sm px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">{s}</span>
            ))}
          </div>
        </div>
      )}
      {skill.assessment && (
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>ارزیابی</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${skill.assessment.score}%` }}></div>
              </div>
            </div>
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{skill.assessment.score}%</span>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>آخرین ارزیابی: {skill.assessment.lastAssessed}</p>
        </div>
      )}
    </div>
  );
}

// ==================== SKILL CREATE ====================
export function SkillCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '', category: 'language', level: 'advanced', subSkills: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await skillsApi.create({ ...formData, subSkills: formData.subSkills.split(',').map(s => s.trim()).filter(s => s) });
    setSubmitting(false);
    navigate('/skills');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/skills')} className="hover:text-indigo-500">مهارت‌ها</button>
        <ArrowRight size={14} /><span style={{ color: 'var(--text-primary)' }}>ایجاد مهارت جدید</span>
      </div>
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>ایجاد مهارت جدید</h1>
        <div className="space-y-5">
          <FormField label="نام مهارت" required><Input value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="مثال: Java" /></FormField>
          <FormField label="توضیحات" required><Input value={formData.description} onChange={v => setFormData({ ...formData, description: v })} multiline rows={3} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="دسته‌بندی">
              <Select value={formData.category} onChange={v => setFormData({ ...formData, category: v })} options={[
                { value: 'language', label: 'زبان' }, { value: 'framework', label: 'فریمورک' }, { value: 'database', label: 'دیتابیس' },
                { value: 'security', label: 'امنیت' }, { value: 'testing', label: 'تست' }, { value: 'devops', label: 'DevOps' },
              ]} />
            </FormField>
            <FormField label="سطح">
              <Select value={formData.level} onChange={v => setFormData({ ...formData, level: v })} options={[
                { value: 'expert', label: 'حرفه‌ای' }, { value: 'advanced', label: 'پیشرفته' }, { value: 'intermediate', label: 'متوسط' },
              ]} />
            </FormField>
          </div>
          <FormField label="زیرمهارت‌ها" hint="با کاما جدا کنید"><Input value={formData.subSkills} onChange={v => setFormData({ ...formData, subSkills: v })} placeholder="sub-skill-1, sub-skill-2" /></FormField>
          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'در حال ایجاد...' : 'ایجاد مهارت'}</Button>
            <Button variant="ghost" onClick={() => navigate('/skills')}>انصراف</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
