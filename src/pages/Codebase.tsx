import { useEffect, useState } from 'react';
import { codebaseApi } from '../services/api';
import { Code2, FileCode, GitBranch, RefreshCw, Search, FolderTree, Layers, Eye, FileText } from 'lucide-react';
import { Badge } from '../components/ui/FormComponents';
import Modal from '../components/ui/Modal';

export default function Codebase() {
  const [overview, setOverview] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showModuleDetail, setShowModuleDetail] = useState(false);
  const [showSymbolDetail, setShowSymbolDetail] = useState(false);
  const [showFileContent, setShowFileContent] = useState(false);

  useEffect(() => {
    Promise.all([codebaseApi.getOverview('p1'), codebaseApi.getModules('p1')]).then(([overviewRes, modulesRes]) => {
      setOverview(overviewRes.data);
      setModules(modulesRes.data);
      setLoading(false);
    });
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    const res = await codebaseApi.search('p1', searchQuery);
    setSearchResults(res.data);
    setSearching(false);
  };

  const handleViewModule = async (moduleName: string) => {
    const res = await codebaseApi.getModuleDetail('p1', moduleName);
    setSelectedModule(res.data);
    setShowModuleDetail(true);
  };

  const handleViewSymbol = async (symbol: string) => {
    const res = await codebaseApi.getSymbolDetail('p1', symbol);
    setSelectedSymbol(res.data);
    setShowSymbolDetail(true);
  };

  const handleViewFile = async (filePath: string) => {
    const res = await codebaseApi.getFileContent('p1', filePath);
    setSelectedFile(res.data);
    setShowFileContent(true);
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="grid grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div>)}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Codebase Intelligence</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>تحلیل و درک خودکار کد پروژه</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
          <RefreshCw size={14} />
          بازایندکس
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <FileCode size={20} className="text-blue-500" />
          <div className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{overview?.totalFiles}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>فایل</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <Code2 size={20} className="text-purple-500" />
          <div className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{(overview?.totalLines / 1000).toFixed(1)}K</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>خط کد</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <Layers size={20} className="text-green-500" />
          <div className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{overview?.modules}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>ماژول</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <GitBranch size={20} className="text-amber-500" />
          <div className="text-sm font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{overview?.lastAnalysis}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>آخرین تحلیل</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="w-5 h-5 rounded-full bg-green-500 animate-pulse"></div>
          <div className="text-sm font-bold mt-2" style={{ color: 'var(--text-primary)' }}>به‌روز</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>وضعیت</div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>جستجو در Codebase</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="جستجوی نماد، فایل یا کد..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/50"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {searching ? 'جستجو...' : 'جستجو'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {searchResults.map((result, i) => (
              <div
                key={i}
                className="p-3 rounded-lg cursor-pointer hover:shadow-md transition-all"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
                onClick={() => handleViewSymbol(result.symbol)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode size={16} className="text-blue-500" />
                    <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{result.file}</span>
                    <Badge variant="info">خط {result.line}</Badge>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-opacity-80" style={{ color: 'var(--text-muted)' }}>
                    <Eye size={14} />
                  </button>
                </div>
                <pre className="text-xs mt-2 font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {result.content}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>زبان‌ها</h2>
        <div className="space-y-3">
          {Object.entries(overview?.languages || {}).map(([lang, percent]: [string, any]) => (
            <div key={lang} className="flex items-center gap-3">
              <span className="text-sm w-20" style={{ color: 'var(--text-primary)' }}>{lang}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${percent}%` }}></div>
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <FolderTree size={18} className="text-indigo-500" />
          ماژول‌ها
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map((mod, i) => (
            <div
              key={i}
              className="p-3 rounded-lg cursor-pointer hover:shadow-md transition-all"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
              onClick={() => handleViewModule(mod.name)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{mod.name}</h3>
                <button className="p-1.5 rounded-lg hover:bg-opacity-80" style={{ color: 'var(--text-muted)' }}>
                  <Eye size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>{mod.files} فایل</span>
                <span>•</span>
                <span>{mod.classes} کلاس</span>
                <span>•</span>
                <span>{mod.dependencies.length} وابستگی</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module Detail Modal */}
      <Modal isOpen={showModuleDetail} onClose={() => setShowModuleDetail(false)} title="جزئیات ماژول" size="lg">
        {selectedModule && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FolderTree size={24} className="text-indigo-500" />
              <h3 className="font-bold text-lg font-mono" style={{ color: 'var(--text-primary)' }}>
                {selectedModule.name}
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>فایل‌ها</div>
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{selectedModule.files}</div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>کلاس‌ها</div>
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{selectedModule.classes}</div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>وابستگی‌ها</div>
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{selectedModule.dependencies?.length || 0}</div>
              </div>
            </div>

            {selectedModule.files && Array.isArray(selectedModule.files) && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>فایل‌ها</div>
                <div className="space-y-2">
                  {selectedModule.files.map((file: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-opacity-80"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                      onClick={() => handleViewFile(file)}
                    >
                      <FileText size={14} className="text-blue-500" />
                      <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedModule.dependencies && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>وابستگی‌ها</div>
                <div className="flex flex-wrap gap-2">
                  {selectedModule.dependencies.map((dep: string, i: number) => (
                    <Badge key={i} variant="info">{dep}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Symbol Detail Modal */}
      <Modal isOpen={showSymbolDetail} onClose={() => setShowSymbolDetail(false)} title="جزئیات نماد" size="lg">
        {selectedSymbol && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Code2 size={24} className="text-purple-500" />
              <div>
                <h3 className="font-bold text-lg font-mono" style={{ color: 'var(--text-primary)' }}>
                  {selectedSymbol.name}
                </h3>
                <Badge variant="info">{selectedSymbol.type}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>فایل</div>
                <div className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{selectedSymbol.file}</div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>خط</div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{selectedSymbol.line}</div>
              </div>
            </div>

            {selectedSymbol.methods && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>متدها</div>
                <div className="flex flex-wrap gap-2">
                  {selectedSymbol.methods.map((method: string, i: number) => (
                    <span key={i} className="text-xs px-2 py-1 rounded font-mono" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {method}()
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedSymbol.dependencies && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>وابستگی‌ها</div>
                <div className="flex flex-wrap gap-2">
                  {selectedSymbol.dependencies.map((dep: string, i: number) => (
                    <Badge key={i} variant="default">{dep}</Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedSymbol.callers && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>صدا زنندگان</div>
                <div className="flex flex-wrap gap-2">
                  {selectedSymbol.callers.map((caller: string, i: number) => (
                    <Badge key={i} variant="info">{caller}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* File Content Modal */}
      <Modal isOpen={showFileContent} onClose={() => setShowFileContent(false)} title="محتوای فایل" size="xl">
        {selectedFile && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-blue-500" />
              <h3 className="font-bold text-lg font-mono" style={{ color: 'var(--text-primary)' }}>
                {selectedFile.path}
              </h3>
            </div>
            <pre className="text-xs font-mono p-4 rounded-lg overflow-auto max-h-96" style={{ backgroundColor: '#1a1a2e', color: '#e2e8f0' }}>
              {selectedFile.content}
            </pre>
          </div>
        )}
      </Modal>
    </div>
  );
}
