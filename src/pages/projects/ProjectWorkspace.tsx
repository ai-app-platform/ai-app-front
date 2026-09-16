import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { workspaceApi } from '../../services/api';
import { FolderOpen, Terminal, RefreshCw, Play, Pause, FileText, HardDrive, Cpu } from 'lucide-react';
import { Badge, Tabs, Input, Button } from '../../components/ui/FormComponents';

export default function ProjectWorkspace() {
  const { project } = useOutletContext<{ project: any }>();
  const [workspace, setWorkspace] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('files');

  useEffect(() => {
    if (project?.workspace) {
      Promise.all([
        workspaceApi.getDetail(project.workspace),
        workspaceApi.getFiles(project.workspace, '/'),
      ]).then(([wsRes, filesRes]) => {
        setWorkspace(wsRes.data);
        setFiles(filesRes.data);
        setLoading(false);
      });
    }
  }, [project?.workspace]);

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;
  if (!workspace) return <div className="text-center py-12"><p style={{ color: 'var(--text-muted)' }}>Workspace یافت نشد</p></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Workspace</h2>
          <p className="text-sm font-mono mt-1" style={{ color: 'var(--text-muted)' }}>{workspace.directory}</p>
        </div>
        <Badge variant={workspace.status === 'active' ? 'success' : workspace.status === 'building' ? 'warning' : 'default'}>
          {workspace.status === 'active' ? 'فعال' : workspace.status === 'building' ? 'در حال build' : 'متوقف'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <HardDrive size={20} className="text-indigo-500 mb-2" />
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{workspace.size}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>حجم</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <FileText size={20} className="text-blue-500 mb-2" />
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
{`[INFO] Compiling ${workspace.files} source files...
[INFO] BUILD SUCCESS
[INFO] Total time: 12.345 s
[INFO] Tests run: ${workspace.testResults?.total}, Failures: ${workspace.testResults?.failed}, Errors: 0`}
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
