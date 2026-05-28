'use client';

import { TrendingDown, Share2, CheckCircle2, AlertTriangle, Mail, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuditResults({ audit, onSave, auditId }) {
  const { totalCurrentSpend, monthlySavings, annualSavings, recommendations, isOptimal, summary } = audit;
  const showCredexPromo = monthlySavings > 500;

  const shareableLink = auditId
    ? `${window.location.origin}/audit/${auditId}${window.location.hash}`
    : null;

  const copyShareableLink = () => {
    navigator.clipboard.writeText(shareableLink);
    toast.success('Link copied!');
  };

  return (
    <div className="space-y-6">

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-xl p-5 text-center border border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Current Spend</p>
          <p className="text-3xl font-bold text-gray-900">${Math.round(totalCurrentSpend)}</p>
          <p className="text-xs text-gray-400 mt-1">per month</p>
        </div>
        <div className={`rounded-xl p-5 text-center border ${
          isOptimal ? 'bg-green-50 border-green-100' : 'bg-green-50 border-green-200'
        }`}>
          <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Monthly Savings</p>
          <p className="text-3xl font-bold text-green-600">${Math.round(monthlySavings)}</p>
          <p className="text-xs text-green-500 mt-1">potential savings</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-100">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Annual Savings</p>
          <p className="text-3xl font-bold text-blue-600">${Math.round(annualSavings)}</p>
          <p className="text-xs text-blue-400 mt-1">per year</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`rounded-xl p-4 flex items-center gap-3 ${
        isOptimal ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
      }`}>
        {isOptimal
          ? <CheckCircle2 size={20} className="text-green-600 shrink-0" />
          : <AlertTriangle size={20} className="text-amber-500 shrink-0" />}
        <p className={`text-sm font-medium ${
          isOptimal ? 'text-green-800' : 'text-amber-800'
        }`}>{summary}</p>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{rec.tool}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{rec.currentPlan}</span>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1.5">
                      <ArrowRight size={13} className="text-green-500 shrink-0" />
                      {rec.recommendedAction}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">{rec.reason}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold text-green-600">${Math.round(rec.savings)}</p>
                    <p className="text-xs text-gray-400">saved/mo</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credex Promo */}
      {showCredexPromo && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-lg font-bold mb-1">Capture these savings with Credex</h3>
              <p className="text-sm text-purple-100">Discounted AI credits from overcapacity providers.</p>
            </div>
            <button
              onClick={() => onSave && onSave('consultation')}
              className="bg-white text-purple-600 px-5 py-2 rounded-lg font-semibold hover:bg-purple-50 text-sm shrink-0"
            >
              Book Consultation →
            </button>
          </div>
        </div>
      )}

      {/* Share + CTA Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {shareableLink && (
          <button
            onClick={copyShareableLink}
            className="group flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200"
          >
            <Share2 size={15} className="group-hover:scale-110 transition-transform duration-200" />
            Copy Shareable Link
          </button>
        )}
        <button
          onClick={() => onSave && onSave('report')}
          className={`group flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-all duration-200 ${
            !shareableLink ? 'sm:col-span-2' : ''
          }`}
        >
          <Mail size={15} className="group-hover:scale-110 transition-transform duration-200" />
          Get Full Report via Email
        </button>
      </div>
    </div>
  );
}