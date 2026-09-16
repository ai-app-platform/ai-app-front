import { useEffect, useState } from 'react';
import { gitApi } from '../services/api';
import { GitBranch, GitCommit, GitPullRequest, Plus, RefreshCw, Check, Clock, AlertCircle } from 'lucide-react';

export default function Git() {
  const [branches, setBranches] = useState<any[]>([]);
  const [commits, setCommits] = useState<any[]>([]);
  const [prs, setPrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('branches');

  useEffect(() => {
    Promise.all([
      gitApi.getBranches('p1'),
      gitApi.getCommits('p1'),
      gitApi.getPullRequests('p1'),
    ]).then(([branchesRes, commitsRes, prsRes]) => {
      setBranches(branchesRes.data);
      setCommits(commitsRes.data);
      setPrs(prsRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div></div>;

  const tabs = [
    { key: 'branches', label: 'Branchها', icon: GitBranch, count: branches.length },
    { key: 'commits', label: 'Commitها', icon: GitCommit, count: commits.length },
    { key: 'prs', label: 'Pull Requestها', icon: GitPullRequest, count: prs.length },
  ];

  const getPrStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return { label: 'باز', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: Check };
      case 'review': return { label: 'در بازبینی', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock };
      case 'merged': return { label: 'ادغام‌شده', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: GitPullRequest };
      default: return { label: status, color: 'bg-gray-100 text-gray-700', icon: AlertCircle };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>مدیریت Git</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Branch، Commit و Pull Request</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            <RefreshCw size={14} />
            Fetch
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium">
            <Plus size={14} />
            Branch جدید
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        {tabs.map(tab => (
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
            {prs.map((pr, i) => {
              const status = getPrStatusBadge(pr.status);
              return (
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
                  <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
