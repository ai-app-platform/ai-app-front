import { useEffect, useState } from 'react';
import { ragApi } from '../services/api';
import { Search, Database, FileText, Code2, BookOpen, RefreshCw, BarChart3, Eye, ExternalLink } from 'lucide-react';
import { Badge } from '../components/ui/FormComponents';
import Modal from '../components/ui/Modal';

export default function RAG() {
  const [indexStatus, setIndexStatus] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    ragApi.getIndexStatus('p1').then(res => {
      setIndexStatus(res.data);
      setLoading(false);
    });
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    const res = await ragApi.search(searchQuery);
    setSearchResults(res.data);
    setSearching(false);
  };

  const handleViewDetail = (result: any) => {
    setSelectedResult(result);
    setShowDetail(true);
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded" style={{ backgroundColor: 'var(--bg-card)' }}></div><div className="h-60 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>RAG</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Retrieval-Augmented Generation - بازیابی و جستجوی اطلاعات</p>
      </div>

      {/* Index Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <Database size={20} className="text-indigo-500" />
          <div className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{indexStatus?.totalDocuments}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>اسناد ایندکس‌شده</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <BarChart3 size={20} className="text-green-500" />
          <div className="text-sm font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{indexStatus?.embeddingModel}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>مدل Embedding</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <RefreshCw size={20} className="text-blue-500" />
          <div className="text-sm font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{indexStatus?.lastIndexed}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>آخرین ایندکس</div>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="w-5 h-5 rounded-full bg-green-500 animate-pulse"></div>
          <div className="text-sm font-bold mt-2" style={{ color: 'var(--text-primary)' }}>سالم</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>وضعیت Index</div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>جستجوی معنایی</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="سؤال خود را وارد کنید..."
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
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                نتایج جستجو ({searchResults.length})
              </h3>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                برای مشاهده جزئیات روی هر نتیجه کلیک کنید
              </span>
            </div>
            {searchResults.map(result => (
              <div
                key={result.id}
                className="p-4 rounded-lg transition-all hover:shadow-md cursor-pointer"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                onClick={() => handleViewDetail(result)}
              >
                <div className="flex items-start gap-3">
                  {result.type === 'code' ? (
                    <Code2 size={20} className="text-blue-500 shrink-0 mt-1" />
                  ) : (
                    <BookOpen size={20} className="text-green-500 shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                        {result.source}
                      </span>
                      <Badge variant={result.type === 'code' ? 'info' : 'success'}>
                        {result.type === 'code' ? 'کد' : 'دانش'}
                      </Badge>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {(result.relevance * 100).toFixed(0)}% مرتبط
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {result.content}
                    </p>
                    {result.lineRange && (
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        خطوط: {result.lineRange}
                      </div>
                    )}
                    {result.chunks && result.chunks.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                          بخش‌های مرتبط:
                        </div>
                        {result.chunks.slice(0, 2).map((chunk: any, i: number) => (
                          <div key={i} className="text-xs p-2 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                              {chunk.text}
                            </span>
                            <span className="text-xs mr-2" style={{ color: 'var(--text-muted)' }}>
                              ({(chunk.score * 100).toFixed(0)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="p-2 rounded-lg hover:bg-opacity-80 transition-colors shrink-0" style={{ color: 'var(--text-muted)' }}>
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="جزئیات نتیجه RAG" size="xl">
        {selectedResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {selectedResult.type === 'code' ? (
                <Code2 size={24} className="text-blue-500" />
              ) : (
                <BookOpen size={24} className="text-green-500" />
              )}
              <div>
                <h3 className="font-bold text-lg font-mono" style={{ color: 'var(--text-primary)' }}>
                  {selectedResult.source}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={selectedResult.type === 'code' ? 'info' : 'success'}>
                    {selectedResult.type === 'code' ? 'کد' : 'دانش'}
                  </Badge>
                  <span className="text-sm px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {(selectedResult.relevance * 100).toFixed(0)}% مرتبط
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                محتوا:
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {selectedResult.content}
              </p>
            </div>

            {selectedResult.lineRange && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>موقعیت</div>
                  <div className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                    خطوط {selectedResult.lineRange}
                  </div>
                </div>
                {selectedResult.metadata && (
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>ماژول</div>
                    <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {selectedResult.metadata.module}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedResult.chunks && selectedResult.chunks.length > 0 && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  بخش‌های مرتبط ({selectedResult.chunks.length})
                </div>
                <div className="space-y-2">
                  {selectedResult.chunks.map((chunk: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                          بخش {i + 1}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                          {(chunk.score * 100).toFixed(0)}% مرتبط
                        </span>
                      </div>
                      <pre className="text-xs font-mono whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                        {chunk.text}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedResult.metadata && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Metadata
                </div>
                <pre className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {JSON.stringify(selectedResult.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
