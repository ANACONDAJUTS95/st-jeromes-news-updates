'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, ArrowRight, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const { user, isAdmin, loading, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary/20 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans flex flex-col items-center justify-center p-6 selection:bg-gold/20">
      
      {/* Subtle Background Glow - Warm tinted */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-surface border border-outline rounded-sm p-10 md:p-14 shadow-academic space-y-10 text-center animate-fade-in border-t-4 border-secondary">
          
          <div className="space-y-6">
            <div className="w-16 h-16 bg-primary rounded-sm flex items-center justify-center mx-auto mb-6 shadow-academic">
              <ShieldCheck className="w-8 h-8 text-surface" />
            </div>
            <h1 className="text-display-md text-primary m-0">Admin Console</h1>
            <p className="text-body-editorial text-on-surface-muted italic leading-relaxed">
              Authenticate with your institutional credentials to access the digital archives.
            </p>
          </div>

          {user && !isAdmin && (
            <div className="p-6 bg-secondary/5 border-l-4 border-secondary text-left animate-slide-up">
              <div className="flex items-center gap-3 mb-2">
                <ShieldAlert className="w-5 h-5 text-secondary shrink-0" />
                <p className="text-label-caps text-secondary m-0">Verification Failure</p>
              </div>
              <p className="text-sm text-on-surface leading-relaxed m-0">
                Account <span className="font-bold underline decoration-secondary/30">{user.email}</span> is not currently registered in the curatorial ledger.
              </p>
            </div>
          )}

          <div className="space-y-6">
            <button
              onClick={loginWithGoogle}
              className="btn-minimal w-full group relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" />
                <span>Continue with Google</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <div className="pt-6 border-t border-outline">
              <p className="text-label-sm text-on-surface-muted tracking-[0.3em] opacity-60 m-0">
                Authorized Access Only
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-on-surface-muted text-xs italic">
            Protected by St. Jerome's Digital Security Protocols
          </p>
        </div>
      </div>
    </div>
  );
}
