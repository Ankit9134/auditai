'use client';

import { useState } from 'react';
import { ScanLine, CheckCircle2, CreditCard, Zap } from 'lucide-react';
import SpendForm from '../components/SpendForm';
import AuditResults from '../components/AuditResults';
import LeadCapture from '../components/LeadCapture';
import FAQ from '../components/FAQ';
import { auditSpend } from '../data/auditEngine';
import toast from 'react-hot-toast';

export default function Home() {
  const [step, setStep] = useState('form');
  const [auditResult, setAuditResult] = useState(null);
  const [auditId, setAuditId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAudit = async (formData) => {
    const loadingToast = toast.loading('Analyzing your AI spend...');
    try {
      const result = auditSpend(formData);
      setAuditResult(result);

      // Encode result into URL hash — no server/DB needed
      const encoded = btoa(encodeURIComponent(JSON.stringify(result)));
      const id = encoded.slice(0, 10); // short ID for display
      setAuditId(id);

      // Store full data in sessionStorage keyed by short id
      sessionStorage.setItem(`audit_${id}`, JSON.stringify(result));
      // Also store full encoded in hash-based key for cross-tab sharing
      sessionStorage.setItem(`audit_encoded_${id}`, encoded);

      window.history.pushState({}, '', `/audit/${id}#${encoded}`);
      toast.success('Audit complete! Share your results!', { id: loadingToast });
      setStep('results');
    } catch (error) {
      console.error('Audit failed:', error);
      toast.error('Failed to analyze. Please try again.', { id: loadingToast });
    }
  };

  const handleSave = () => setStep('capture');

  const handleCaptureComplete = () => {
    toast.success('Thanks! Check your email for the full report.');
    setStep('results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center gap-2">
          <ScanLine size={22} className="text-blue-600" />
          <span className="font-bold text-gray-500 text-white">SpendScanAI</span>
        </div>
      </header>

      {/* Hero */}
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Zap size={14} />
          Free AI Spend Audit
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Audit Your AI Spend
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover hidden savings across Cursor, GitHub Copilot, Claude, ChatGPT, and more
        </p>
        <div className="mt-8 flex justify-center gap-6 flex-wrap text-sm text-gray-500">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-green-500" /> Used by 500+ startups</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-green-500" /> Free audit</span>
          <span className="flex items-center gap-1.5"><CreditCard size={15} className="text-green-500" /> No credit card</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-10">
        {step === 'form' && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <SpendForm onSubmit={handleAudit} />
          </div>
        )}
        {step === 'results' && auditResult && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <AuditResults audit={auditResult} onSave={handleSave} auditId={auditId} />
          </div>
        )}
        {step === 'capture' && (
          <LeadCapture
            auditData={{ auditResult, auditId }}
            onSuccess={handleCaptureComplete}
          />
        )}
      </div>

      <div className="bg-gray-50 py-8">
        <FAQ />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <p className="text-gray-500">Trusted by founders from</p>
            <div className="flex justify-center gap-8 mt-4 opacity-50 flex-wrap">
              <span className="text-lg font-semibold">Y Combinator</span>
              <span className="text-lg font-semibold">Techstars</span>
              <span className="text-lg font-semibold">500 Startups</span>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
}