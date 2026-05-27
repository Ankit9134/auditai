'use client';

import { TrendingDown, Share2, CheckCircle2, AlertTriangle, Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AuditResults({ audit, onSave, auditId }) {
  const { totalCurrentSpend, monthlySavings, annualSavings, recommendations, isOptimal, summary } = audit;
  const showCredexPromo = monthlySavings > 500;

  const shareableLink = auditId
    ? `${window.location.origin}/audit/${auditId}${window.location.hash}`
    : null;

  const copyShareableLink = () => {
    navigator.clipboard.writeText(shareableLink);
    toast.success('Shareable link copied!');
  };

  return (
    <div className="space-y-8">
      {/* Hero Savings */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-2 mb-4">
          {isOptimal
            ? <CheckCircle2 size={16} className="text-green-700" />
            : <TrendingDown size={16} className="text-green-700" />}
          <span className="text-green-800 font-semibold">
            {isOptimal ? 'Optimized Setup' : 'Savings Found!'}
          </span>
        </div>

        {!isOptimal && (
          <>
            <div className="text-5xl font-bold text-green-600 mb-2">
              ${Math.round(monthlySavings)}/month
            </div>
            <div className="text-2xl text-gray-600">
              ${Math.round(annualSavings)}/year in potential savings
            </div>
          </>
        )}
        {isOptimal && (
          <div className="text-2xl text-gray-600">Your current setup is already optimized</div>
        )}
      </div>

      {/* Share */}
      {shareableLink && (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Share your results:</p>
          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              value={shareableLink}
              readOnly
              className="flex-1 max-w-md px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={copyShareableLink}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <Share2 size={15} /> Copy Link
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
        <p className="text-blue-800">{summary}</p>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            Detailed Recommendations
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{rec.tool}</h4>
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <TrendingDown size={14} /> Save ${Math.round(rec.savings)}/month
                  </span>
                </div>
                <p className="text-gray-700 mb-2">
                  Current: {rec.currentPlan} (${rec.currentSpend}/month) → Recommended: {rec.recommendedAction}
                </p>
                <p className="text-sm text-gray-500">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credex Promo */}
      {showCredexPromo && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">Want to capture these savings easily?</h3>
          <p className="mb-4">Credex provides discounted AI credits from overcapacity providers. Book a consultation to learn how.</p>
          <button
            onClick={() => onSave && onSave('consultation')}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
          >
            Book Credex Consultation →
          </button>
        </div>
      )}

      {/* Lead Capture CTA */}
      <div className="text-center pt-6 border-t border-gray-200">
        <button
          onClick={() => onSave && onSave('report')}
          className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 flex items-center gap-2 mx-auto"
        >
          <Mail size={16} /> Get Full Report via Email
        </button>
        <p className="text-sm text-gray-500 mt-2">Includes detailed breakdown and personalized recommendations</p>
      </div>
    </div>
  );
}