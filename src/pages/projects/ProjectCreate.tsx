import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi, connectorsApi } from '../../services/api';
import { ArrowRight, Plus } from 'lucide-react';
import { FormField, Input, Select, Button } from '../../components/ui/FormComponents';

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', description: '', language: 'java', gitUrl: '', connectorId: '', workflowId: 'w1',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await projectsApi.create(formData);
    setSubmitting(false);
    navigate('/projects');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <button onClick={() => navigate('/projects')} className="hover:text-indigo-500">پروژه‌ها</button>
        <ArrowRight size={14} />
        <span style={{ color: 'var(--text-primary)' }}>ایجاد پروژه جدید</span>
      </div>

      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>ایجاد پروژه جدید</h1>

        <div className="space-y-5">
          <FormField label="نام پروژه" required>
            <Input value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="مثال: پروژه فروشگاه آنلاین" />
          </FormField>

          <FormField label="توضیحات" required>
            <Input value={formData.description} onChange={v => setFormData({ ...formData, description: v })} placeholder="توضیح مختصر درباره پروژه" multiline rows={3} />
          </FormField>

          <FormField label="زبان برنامه‌نویسی" required>
            <Select
              value={formData.language}
              onChange={v => setFormData({ ...formData, language: v })}
              options={[
                { value: 'java', label: 'Java' },
                { value: 'typescript', label: 'TypeScript' },
                { value: 'python', label: 'Python' },
                { value: 'go', label: 'Go' },
                { value: 'rust', label: 'Rust' },
              ]}
            />
          </FormField>

          <FormField label="آدرس Git Repository" required hint="مثال: github.com/organization/repository">
            <Input value={formData.gitUrl} onChange={v => setFormData({ ...formData, gitUrl: v })} placeholder="github.com/org/repo" />
          </FormField>

          <FormField label="اتصال‌دهنده Git">
            <Select
              value={formData.connectorId}
              onChange={v => setFormData({ ...formData, connectorId: v })}
              placeholder="انتخاب اتصال‌دهنده..."
              options={[
                { value: 'c1', label: 'GitHub - فروشگاه' },
                { value: 'c2', label: 'GitHub - API Gateway' },
                { value: 'c6', label: 'GitLab - موبایل' },
              ]}
            />
          </FormField>

          <FormField label="Workflow پیش‌فرض">
            <Select
              value={formData.workflowId}
              onChange={v => setFormData({ ...formData, workflowId: v })}
              options={[
                { value: 'w1', label: 'توسعه نرم‌افزار' },
                { value: 'w2', label: 'توسعه Frontend' },
                { value: 'w3', label: 'بهینه‌سازی' },
              ]}
            />
          </FormField>

          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'در حال ایجاد...' : 'ایجاد پروژه'}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/projects')}>انصراف</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
