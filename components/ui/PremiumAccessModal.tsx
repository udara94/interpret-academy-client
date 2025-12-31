"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

interface PremiumAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  dialogTitle?: string;
  contentType?: 'dialog' | 'vocabulary';
}

export default function PremiumAccessModal({
  isOpen,
  onClose,
  dialogTitle,
  contentType = 'dialog',
}: PremiumAccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push(ROUTES.DASHBOARD.PAYMENTS);
  };

  const contentLabel = contentType === 'vocabulary' ? 'vocabulary category' : 'dialog';
  const contentLabelPlural = contentType === 'vocabulary' ? 'vocabulary categories' : 'dialogs';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card card-elevated w-full max-w-md mx-4 p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
            <span className="text-3xl">💎</span>
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            Premium Access Required
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400">
            {dialogTitle ? (
              <>
                This {contentLabel} <span className="font-semibold">"{dialogTitle}"</span> is available
                exclusively for premium members.
              </>
            ) : (
              `This ${contentLabel} is available exclusively for premium members.`
            )}
          </p>
        </div>

        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-secondary-700 dark:text-secondary-300 text-center">
            Upgrade to premium to unlock access to all premium {contentLabelPlural} and exclusive features.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}

