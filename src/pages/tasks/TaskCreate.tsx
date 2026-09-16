import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksApi, projectsApi } from '../../services/api';
import { ArrowRight } from 'lucide-react';
import { FormField, Input, Select, Button } from '../../components/ui/FormComponents';

export default function TaskCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', projectId: 'p1', priority: 'medium', workflowId: 'w1',
    requirements: '', assignedAgents: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await tasksApi.create(formData);
    setSubmitting(false);
    navigate('/tasks');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/tasks')} className="hover:text-indigo-500">تسک‌ها</button>
        <ArrowRight size={14} />
        <span style={{ color: 'var(--text-primary)' }}>ایجاد تسک جدید</span>
      </div>

      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>ایجاد تسک جدید</h1>

        <div className="space-y-5">
          <FormField label="عنوان تسک" required>
            <Input value={formData.title} onChange={v => setFormData({ ...formData, title: v })} placeholder="مثال: پیاده‌سازی OAuth2 Login" />
          </FormField>

          <FormField label="توضیحات" required>
            <Input value={formData.description} onChange={v => setFormData({ ...formData, description: v })} placeholder="توضیح کامل تسک" multiline rows={4} />
          </FormField>

          <FormField label="پروژه" required>
            <Select
              value={formData.projectId}
              onChange={v => setFormData({ ...formData, projectId: v })}
              options={[
                { value: 'p1', label: 'پروژه فروشگاه آنلاین' },
                { value: 'p2', label: 'پروژه API Gateway' },
                { value: 'p3', label: 'پروژه موبایل' },
              ]}
            />
          </FormField>

          <FormField label="اولویت" required>
            <Select
              value={formData.priority}
              onChange={v => setFormData({ ...formData, priority: v })}
              options={[
                { value: 'high', label: 'بالا' },
                { value: 'medium', label: 'متوسط' },
                { value: 'low', label: 'پایین' },
              ]}
            />
          </FormField>

          <FormField label="Workflow">
            <Select
              value={formData.workflowId}
              onChange={v => setFormData({ ...formData, workflowId: v })}
              options={[
                { value: 'w1', label: 'توسعه نرم‌افزار' },
                { value: 'w2', label: 'توسعه Frontend' },
                { value: 'w3', label: 'بهینه‌سازی' },
                { value: 'w4', label: 'بررسی امنیتی' },
              ]}
            />
          </FormField>

          <FormField label="الزامات" hint="هر الزام در یک خط">
            <Input value={formData.requirements} onChange={v => setFormData({ ...formData, requirements: v })} placeholder="الزام 1&#10;الزام 2&#10;الزام 3" multiline rows={4} />
          </FormField>

          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'در حال ایجاد...' : 'ایجاد تسک'}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/tasks')}>انصراف</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
