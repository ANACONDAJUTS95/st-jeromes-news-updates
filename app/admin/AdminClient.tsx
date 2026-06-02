'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, RefreshCw, ExternalLink, Calendar,
  CheckCircle2, AlertCircle, Loader2, LogOut,
  LayoutDashboard, Newspaper, Activity, Settings,
  ArrowUpRight, Clock, Database, Menu, X, Trash2, ShieldAlert, Wifi
} from 'lucide-react';
import { Article } from '@/lib/articles';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface AdminClientProps {
  initialArticles: Article[];
}

export default function AdminClient({ initialArticles }: AdminClientProps) {
  const { user, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<{ ok: boolean; results: Record<string, { ok: boolean; detail: string }> } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [confirmInput, setConfirmInput] = useState('');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login');
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary/20 animate-spin" />
      </div>
    );
  }

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!articleToDelete) return;
    
    const id = articleToDelete.id;
    setDeletingId(id);
    setIsDeleteModalOpen(false);
    
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setArticles(prev => prev.filter(a => a.id !== id));
        setSyncStatus({ type: 'success', message: 'Article successfully removed from the archives.' });
      } else {
        const error = await response.json();
        setSyncStatus({ type: 'error', message: error.error || 'Failed to delete record' });
      }
    } catch (err) {
      setSyncStatus({ type: 'error', message: 'Communication error during archival purge.' });
    } finally {
      setDeletingId(null);
      setArticleToDelete(null);
      setConfirmInput('');
    }
  };

  const openDeleteModal = (article: Article) => {
    setArticleToDelete(article);
    setConfirmInput('');
    setIsDeleteModalOpen(true);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResults(null);
    try {
      const token = await user?.getIdToken();
      const res = await fetch('/api/admin/test-connection', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTestResults(data);
    } catch {
      setTestResults({ ok: false, results: { network: { ok: false, detail: 'Could not reach the server' } } });
    } finally {
      setTesting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus(null);
    
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/news/sync', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSyncStatus({ type: 'success', message: 'Sync pipeline dispatched. The GitHub Action runs in the background — new articles appear in 3–5 minutes. Refresh this page after a moment.' });
      } else {
        setSyncStatus({ type: 'error', message: data.error || 'Failed to trigger sync' });
      }
    } catch (error) {
      setSyncStatus({ type: 'error', message: 'An unexpected error occurred' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans selection:bg-gold/20">
      
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-surface border-b border-outline sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-surface" />
          </div>
          <span className="font-serif font-bold text-primary tracking-tight">Admin Console</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-primary/60">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex h-full min-h-screen">
        
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-outline transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full p-6 justify-between">
            <div>
              <div className="hidden lg:flex items-center gap-3 mb-10">
                <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center shadow-academic">
                  <LayoutDashboard className="w-5 h-5 text-surface" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-primary tracking-tight leading-none text-lg">Console</span>
                  <span className="text-[9px] text-on-surface-muted uppercase tracking-widest mt-0.5">St. Jerome v2</span>
                </div>
              </div>

              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-primary/5 text-primary rounded-sm transition-all border-l-2 border-primary font-bold text-sm">
                  <Newspaper className="w-4 h-4" />
                  <span className="font-serif">News Feed</span>
                </button>
                {/* <button className="w-full flex items-center gap-3 px-3 py-2.5 text-on-surface-muted hover:text-primary hover:bg-surface-muted rounded-sm transition-all text-sm">
                  <Activity className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-on-surface-muted hover:text-primary hover:bg-surface-muted rounded-sm transition-all text-sm">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button> */}
              </nav>
            </div>

            <div className="pt-6 border-t border-outline space-y-4">
              <div className="px-3 py-2 bg-surface-container-low rounded-sm flex items-center gap-3 border border-outline">
                <div className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center text-[10px] font-bold text-surface">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-primary truncate">{user?.email?.split('@')[0]}</span>
                  <span className="text-[9px] text-on-surface-muted truncate uppercase tracking-tighter">System Admin</span>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 text-secondary hover:bg-secondary/5 rounded-sm transition-all text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            
            {/* Top Bar / Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
              <div className="space-y-0.5">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary m-0">News Dashboard</h2>
                <p className="text-on-surface-muted text-xs flex items-center gap-2 italic">
                  <Clock className="w-3.5 h-3.5 opacity-50" /> System update checked: {new Date().toLocaleTimeString()}
                </p>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="btn-outline group px-4 py-2 text-xs"
                >
                  {testing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                  ) : (
                    <Wifi className="w-3.5 h-3.5 mr-2" />
                  )}
                  <span>{testing ? 'Testing...' : 'Test Connection'}</span>
                </button>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="btn-minimal group px-5 py-2.5 text-sm"
                >
                  {syncing ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-700" />
                  )}
                  <span>{syncing ? 'Synchronizing...' : 'Sync with Page'}</span>
                </button>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <div className="bg-surface border border-outline p-5 lg:p-6 rounded-sm space-y-3 shadow-academic">
                <div className="w-8 h-8 bg-primary/5 rounded-sm flex items-center justify-center">
                  <Database className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-muted m-0">Total Articles</p>
                  <p className="text-3xl font-serif font-bold text-primary mt-0.5">{initialArticles.length}</p>
                </div>
              </div>
              <div className="bg-surface border border-outline p-5 lg:p-6 rounded-sm space-y-3 shadow-academic">
                <div className="w-8 h-8 bg-emerald-500/5 rounded-sm flex items-center justify-center">
                  <Activity className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-muted m-0">System Status</p>
                  <div className="text-3xl font-serif font-bold text-emerald-600 mt-0.5 flex items-center gap-2">
                    Active <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
              </div>
              <div className="bg-surface border border-outline p-5 lg:p-6 rounded-sm space-y-3 shadow-academic">
                <div className="w-8 h-8 bg-gold/10 rounded-sm flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-muted m-0">Latest Sync</p>
                  <p className="text-xl font-serif font-bold text-primary mt-0.5">
                    {(() => {
                      const latest = initialArticles
                        .map(a => a.syncedAt)
                        .filter(Boolean)
                        .sort()
                        .at(-1);
                      if (!latest) return 'Never';
                      const d = new Date(latest);
                      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
                        ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Connection Test Results */}
            {testResults && (
              <div className={`rounded-sm border animate-slide-up overflow-hidden ${testResults.ok ? 'border-emerald-500/20' : 'border-secondary/20'}`}>
                <div className={`px-5 py-3 flex items-center gap-3 ${testResults.ok ? 'bg-emerald-500/5' : 'bg-secondary/5'}`}>
                  {testResults.ok
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    : <AlertCircle className="w-4 h-4 text-secondary shrink-0" />}
                  <p className={`text-label-caps m-0 ${testResults.ok ? 'text-emerald-700' : 'text-secondary'}`}>
                    {testResults.ok ? 'All systems operational' : 'Connection issues detected'}
                  </p>
                  <button onClick={() => setTestResults(null)} className="ml-auto text-on-surface-muted hover:text-primary transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-outline/20">
                  {Object.entries(testResults.results).map(([key, val]) => (
                    <div key={key} className="px-5 py-3 flex items-start gap-3 bg-surface">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${val.ok ? 'bg-emerald-500' : 'bg-secondary'}`} />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-muted m-0">{key}</p>
                        <p className="text-sm font-serif text-primary m-0 mt-0.5">{val.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sync Notification */}
            {syncStatus && (
              <div className={`p-5 rounded-sm border flex items-start gap-4 animate-slide-up ${
                syncStatus.type === 'success'
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800'
                  : 'bg-secondary/5 border-secondary/20 text-secondary'
              }`}>
                {syncStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-base m-0 leading-snug">{syncStatus.message}</p>
                  {syncStatus.type === 'success' && (
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-3 text-[10px] font-bold uppercase tracking-widest underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      Refresh page →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Data Table Section */}
            <div className="bg-surface border border-outline rounded-sm overflow-hidden shadow-academic">
              <div className="p-6 md:p-8 border-b border-outline flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-container-low/50">
                <h3 className="text-xl font-serif font-bold text-primary m-0">Articles Archive</h3>
                <div className="relative w-full md:w-96 group">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-muted w-4 h-4 group-focus-within:text-secondary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search archives..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-b border-outline focus:border-secondary py-3 pl-8 pr-4 focus:outline-none transition-all placeholder:italic font-serif text-base"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-surface-container text-on-surface-muted text-[10px] font-bold uppercase tracking-widest border-b border-outline">
                      <th className="px-8 py-4">Headline & Content</th>
                      <th className="px-8 py-4">Taxonomy</th>
                      <th className="px-8 py-4">Archived Date</th>
                      <th className="px-8 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline">
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map((article) => (
                        <tr key={article.id} className="hover:bg-surface-muted transition-all group">
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-1 max-w-xl">
                              <span className="text-base font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">{article.title}</span>
                              <span className="text-sm text-on-surface-muted/80 line-clamp-1 italic">{article.excerpt}</span>
                            </div>
                          </td>
                          <td className="px-8 py-8">
                            <span className="px-3 py-1 bg-surface-container border border-outline-variant text-label-sm rounded-sm">
                              {article.category || 'Editorial'}
                            </span>
                          </td>
                          <td className="px-8 py-8">
                            <div className="flex items-center gap-3 text-on-surface-muted text-sm">
                              <Calendar className="w-4 h-4 opacity-40" />
                              <span className="font-sans">
                                {new Date(article.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-8 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <a
                                href={`/news/${article.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline group/btn text-xs px-3 py-1.5"
                              >
                                <span className="mr-2">Details</span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                              </a>
                              <button
                                onClick={() => openDeleteModal(article)}
                                disabled={deletingId === article.id}
                                className="p-2 text-on-surface-muted hover:text-secondary hover:bg-secondary/5 rounded-sm transition-all disabled:opacity-50"
                                title="Delete Article"
                              >
                                {deletingId === article.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 text-secondary/40 group-hover:text-secondary" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-24 text-center">
                          <p className="text-body-editorial italic text-on-surface-muted text-xl m-0">
                            No records match your current inquiry.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="p-6 border-t border-outline bg-surface-container-low/30">
                <p className="text-label-sm text-on-surface-muted text-center m-0">
                  Displaying {filteredArticles.length} of {initialArticles.length} total entries • Archival Integrity Verified
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && articleToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-surface border-2 border-secondary shadow-2xl rounded-sm p-8 md:p-10 animate-in zoom-in-95 duration-200">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-sm flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-primary m-0">Confirm Archival Purge</h3>
                  <p className="text-on-surface-muted text-sm mt-1 italic">This action is irreversible and will remove the record from public archives.</p>
                </div>
              </div>

              <div className="p-4 bg-secondary/5 border-l-4 border-secondary space-y-2">
                <p className="text-sm font-bold text-secondary uppercase tracking-widest m-0">Warning</p>
                <p className="text-sm text-on-surface leading-relaxed m-0">
                  You are about to delete: <span className="font-bold underline">{articleToDelete.title}</span>
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-on-surface-muted">
                  Please type the full article title to confirm this operation:
                </p>
                <input
                  type="text"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder="Type title here..."
                  className="w-full bg-surface-container border border-outline focus:border-secondary p-4 font-serif text-lg outline-none transition-all placeholder:opacity-30"
                  autoFocus
                />
              </div>

              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <button
                  onClick={handleDelete}
                  disabled={confirmInput !== articleToDelete.title}
                  className={`flex-1 py-4 font-bold tracking-widest uppercase text-sm transition-all rounded-sm border-2 ${
                    confirmInput === articleToDelete.title
                      ? 'bg-secondary border-secondary text-surface hover:bg-primary hover:border-primary shadow-lg active:scale-[0.98]'
                      : 'bg-on-surface-muted/10 border-on-surface-muted/20 text-on-surface-muted/40 cursor-not-allowed'
                  }`}
                >
                  Permanently Purge
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 font-bold tracking-widest uppercase text-sm border-2 border-outline text-on-surface hover:bg-surface-muted transition-all rounded-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
