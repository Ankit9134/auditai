'use client';

import { useState, useEffect } from 'react';
import { ScanLine, Loader2, FileX, ArrowLeft } from 'lucide-react';
import AuditResults from '../../../components/AuditResults';

export default function SharedAuditPage({ params }) {
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auditId, setAuditId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setAuditId(id);

      // 1. Try URL hash (works for shared links — no server needed)
      const hash = window.location.hash.slice(1);
      if (hash) {
        try {
          const decoded = JSON.parse(decodeURIComponent(atob(hash)));
          setAudit(decoded);
          setLoading(false);
          return;
        } catch {}
      }

      // 2. Try sessionStorage (same browser)
      const cached = sessionStorage.getItem(`audit_${id}`);
      if (cached) {
        try {
          setAudit(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {}
      }

      // 3. Try reconstructing from stored encoded
      const encoded = sessionStorage.getItem(`audit_encoded_${id}`);
      if (encoded) {
        try {
          const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
          setAudit(decoded);
          setLoading(false);
          return;
        } catch {}
      }

      setLoading(false);
    };

    load();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileX size={48} className="text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Audit Not Found</h1>
          <p className="text-gray-600">This link may be incomplete. Try sharing the full URL including the # part.</p>
          <a href="/" className="inline-flex items-center gap-1.5 mt-4 text-blue-600 hover:text-blue-700">
            <ArrowLeft size={16} /> Start a new audit
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <ScanLine size={20} className="text-blue-600" />
          <span className="font-bold text-gray-900">SpendScanAI</span>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-100 rounded-full px-4 py-1 mb-4">
              <span className="text-blue-800 text-sm font-medium">Shared Audit Report</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Spend Audit Results</h1>
            <p className="text-gray-600">Check out these savings opportunities</p>
          </div>
          <AuditResults audit={audit} onSave={() => {}} auditId={auditId} />
        </div>
      </div>
    </div>
  );
}