'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loadUser } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('autoify_token', token);
      loadUser().then(() => {
        toast.success('Successfully logged in with Google! 🎉');
        router.push('/dashboard');
      });
    } else {
      toast.error('Authentication failed');
      router.push('/auth/login');
    }
  }, [searchParams, router, loadUser]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
      <p className="text-slate-400 text-sm animate-pulse">Completing authentication...</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <CallbackContent />
    </Suspense>
  );
}
