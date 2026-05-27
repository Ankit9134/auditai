'use client';

import { useState } from 'react';
import { Mail, Building2, UserCircle, Lock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeadCapture({ auditData, onSuccess }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/save-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, role, auditData })
      });
      if (response.ok) {
        toast.success('Report saved! Check your email.');
        onSuccess && onSuccess();
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Your Full Report</h3>
      <p className="text-gray-600 mb-6">Enter your email to receive a detailed breakdown and personalized recommendations.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <Mail size={14} /> Email Address *
          </label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <Building2 size={14} /> Company Name
          </label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Your startup" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <UserCircle size={14} /> Role
          </label>
          <select value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Select role</option>
            <option value="founder">Founder/CEO</option>
            <option value="cto">CTO/Engineering Lead</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
          <Send size={15} />
          {isSubmitting ? 'Saving...' : 'Get Report →'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500 flex items-center justify-center gap-2">
          <Lock size={11} /> No spam
          <span>•</span>
          <Mail size={11} /> Instant delivery
        </div>
      </div>
    </div>
  );
}