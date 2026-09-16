import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { gitApi } from '../../services/api';
import { GitBranch, GitCommit, GitPullRequest, Plus, Eye, Code } from 'lucide-react';
import { Badge } from '../../components/ui/FormComponents';
import Modal from '../../components/ui/Modal';
import { FormField, Input, Select, Button } from '../../components/ui/FormComponents';

export default function ProjectGit() {
  const { project } = useOutletContext<{ project: any }>();
  const [branches, setBranches] = useState<any[]>([]);
  const [commits, setCommits] = useState<any[]>([]);
  const [prs, setPrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('branches');
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [diffData, setDiffData] = useState<any>(null);
  const [newBranch, setNewBranch] = useState({ name: '', baseBranch: 'main' });

  useEffect(() => {
    if (project?.id) {
      Promise.all([
        gitApi.getBranches(project.id),
        gitApi.getCommits(project.id),
        gitApi.getPullRequests(project.id),
      ]).then(([branchesRes, commitsRes, prsRes]) => {
        setBranches(branchesRes.data);
        setCommits(commitsRes.data);
        setPrs(prsRes.data);
        setLoading(false);
      });
    }
  }, [project?.id]);

  const handleCreateBranch = async () => {
    await gitApi.createBranch(project.id, newBranch);
    setBranches([...branches, { name: newBranch.name, isDefault: false, lastCommit: 'new', ahead: 0, behind: 0 }]);
    setShowCreateBranch(false);
    setNewBranch({ name: '', baseBranch: 'main' });
  };

  const handleViewDiff = async (branchName: string) => {
    const res = await gitApi.getDiff(project.id, branchName);
    setDiffData(res.data);
    setShowDiff(true);
  };

  if (loading) return <div className="animate-pulse h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>مدیریت Git</h2>
        <button onClick={() => setShowCreateBranch(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
          <Plus size={14} />
          Branch جدید
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        {[
          { key: 'branches', label: 'Branchها', icon: GitBranch, count: branches.length },
          { key: 'commits', label: 'Commitها', icon: GitCommit, count: commits.length },
          { key: 'prs', label: 'Pull Requestها', icon: GitPullRequest, count: prs.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              activeTab === tab.key ? 'bg-indigo-600 text-white' : ''
            }`}
            style={activeTab !== tab.key ? { color: 'var(--text-secondary)' } : {}}
          >
            <tab.icon size={14} />
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20' : ''}`} style={activeTab !== tab.key ? { backgroundColor: 'var(--bg-tertiary)' } : {}}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        {activeTab === 'branches' && (
          <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {branches.map((branch, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-opacity-50 transition-colors">
                <div className="flex items-center gap-3">
                  <GitBranch size={16} className={branch.isDefault ? 'text-green-500' : 'text-indigo-500'} />
                  <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{branch.name}</span>
                  {branch.isDefault && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">default</span>}
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-mono">{branch.lastCommit}</span>
                  {branch.ahead > 0 && <span className="text-green-500">↑{branch.ahead}</span>}
                  {branch.behind > 0 && <span className="text-red-500">↓{branch.behind}</span>}
                  {!branch.isDefault && (
                    <button onClick={() => handleViewDiff(branch.name)} className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600">
                      <Eye size={12} />Diff
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'commits' && (
          <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {commits.map((commit, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <GitCommit size={16} className="text-indigo-500" />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{commit.message}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{commit.author}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>•</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{commit.date}</span>
                    </div>
                  </div>
                </div>
                <span className="font-mono text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{commit.sha}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'prs' && (
          <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {prs.map((pr, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <GitPullRequest size={16} className="text-indigo-500" />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{pr.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{pr.branch}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>• {pr.comments} نظر</span>
                    </div>
                  </div>
                </div>
                <Badge variant={pr.status === 'open' ? 'success' : pr.status === 'review' ? 'warning' : 'info'}>
                  {pr.status === 'open' ? 'باز' : pr.status === 'review' ? 'در بازبینی' : 'ادغام‌شده'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Branch Modal */}
      <Modal isOpen={showCreateBranch} onClose={() => setShowCreateBranch(false)} title="ایجاد Branch جدید">
        <div className="space-y-4">
          <FormField label="نام Branch" required>
            <Input value={newBranch.name} onChange={v => setNewBranch({ ...newBranch, name: v })} placeholder="feature/my-feature" />
          </FormField>
          <FormField label="Branch پایه">
            <Select value={newBranch.baseBranch} onChange={v => setNewBranch({ ...newBranch, baseBranch: v })} options={branches.map(b => ({ value: b.name, label: b.name }))} />
          </FormField>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleCreateBranch}>ایجاد</Button>
            <Button variant="ghost" onClick={() => setShowCreateBranch(false)}>انصراف</Button>
          </div>
        </div>
      </Modal>

      {/* Diff Modal */}
      <Modal isOpen={showDiff} onClose={() => setShowDiff(false)} title="نمایش Git Diff" size="xl">
        {diffData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Badge variant="info">{diffData.branch}</Badge>
              <span>←</span>
              <Badge variant="default">{diffData.baseBranch}</Badge>
            </div>
            <div className="space-y-2">
              {diffData.files?.map((file: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <Code size={14} className="text-indigo-500" />
                    <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{file.path}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-500">+{file.additions}</span>
                    <span className="text-red-500">-{file.deletions}</span>
                    <Badge variant={file.status === 'added' ? 'success' : 'warning'}>{file.status === 'added' ? 'جدید' : 'تغییر'}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Diff Content</h3>
              <pre className="text-xs font-mono p-4 rounded-lg overflow-auto max-h-96" style={{ backgroundColor: '#1a1a2e', color: '#e2e8f0' }}>
                {diffData.diffContent}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
