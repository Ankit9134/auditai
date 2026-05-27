'use client';

import { useState, useEffect } from 'react';
import { ScanLine, Loader2, FileX, ArrowLeft } from 'lucide-react';
import AuditResults from '../../../components/AuditResults';

export default function SharedAuditPage({ params }) {
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auditId, setAuditId] = useState(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setAuditId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!auditId) return;

    const fetchAudit = async () => {
      const cached = sessionStorage.getItem(`audit_${auditId}`);
      if (cached) {
        try {
          setAudit(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {}
      }

      // 2. Fallback to API
      try {
        const response = await fetch(`/api/audit?id=${auditId}`);
        if (response.ok) {
          const data = await response.json();
          setAudit(data.audit);
        }
      } catch (error) {
        console.error('Failed to load audit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, [auditId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
          <p className="text-gray-600">Loading audit results...</p>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileX size={48} className="text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Audit Not Found</h1>
          <p className="text-gray-600">This audit report doesn't exist or has been removed.</p>
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