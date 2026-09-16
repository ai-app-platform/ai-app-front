import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { agentsApi } from '../../services/api';
import { ArrowRight } from 'lucide-react';
import { FormField, Input, Select, Button } from '../../components/ui/FormComponents';

export default function AgentCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', description: '', type: 'developer', model: 'GPT-4',
    skills: '', roles: '', temperature: '0.3', maxTokens: '8000',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await agentsApi.create({
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()),
      roles: formData.roles.split(',').map(r => r.trim()),
      configuration: { temperature: parseFloat(formData.temperature), maxTokens: parseInt(formData.maxTokens) },
    });
    setSubmitting(false);
    navigate('/agents');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/agents')} className="hover:text-indigo-500">Agentها</button>
        <ArrowRight size={14} />
        <span style={{ color: 'var(--text-primary)' }}>ایجاد Agent جدید</span>
      </div>

      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>ایجاد Agent جدید</h1>

        <div className="space-y-5">
          <FormField label="نام Agent" required>
            <Input value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="مثال: توسعه‌دهنده Backend" />
          </FormField>

          <FormField label="توضیحات" required>
            <Input value={formData.description} onChange={v => setFormData({ ...formData, description: v })} placeholder="توضیح درباره وظایف Agent" multiline rows={3} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="نوع Agent" required>
              <Select value={formData.type} onChange={v => setFormData({ ...formData, type: v })} options={[
                { value: 'architect', label: 'معمار' },
                { value: 'developer', label: 'توسعه‌دهنده' },
                { value: 'reviewer', label: 'بازبین' },
                { value: 'tester', label: 'تست‌نویس' },
                { value: 'security', label: 'متخصص امنیت' },
                { value: 'planner', label: 'برنامه‌ریز' },
              ]} />
            </FormField>

            <FormField label="مدل ZBA" required>
              <Select value={formData.model} onChange={v => setFormData({ ...formData, model: v })} options={[
                { value: 'GPT-4', label: 'GPT-4' },
                { value: 'GPT-3.5', label: 'GPT-3.5' },
                { value: 'Claude-3', label: 'Claude-3' },
              ]} />
            </FormField>
          </div>

          <FormField label="مهارت‌ها" hint="مهارت‌ها را با کاما جدا کنید">
            <Input value={formData.skills} onChange={v => setFormData({ ...formData, skills: v })} placeholder="java, spring-boot, api-design" />
          </FormField>

          <FormField label="نقش‌ها" hint="نقش‌ها را با کاما جدا کنید">
            <Input value={formData.roles} onChange={v => setFormData({ ...formData, roles: v })} placeholder="developer, reviewer" />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Temperature" hint="0.0 تا 1.0">
              <Input value={formData.temperature} onChange={v => setFormData({ ...formData, temperature: v })} type="number" />
            </FormField>

            <FormField label="حداکثر Token">
              <Input value={formData.maxTokens} onChange={v => setFormData({ ...formData, maxTokens: v })} type="number" />
            </FormField>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'در حال ایجاد...' : 'ایجاد Agent'}</Button>
            <Button variant="ghost" onClick={() => navigate('/agents')}>انصراف</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
