"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { dialogsApi, Dialog } from "@/lib/api/dialogs-api";
import { useMembership } from "@/lib/hooks/use-membership";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";

export default function DialogsPage() {
  const { hasActiveMembership } = useMembership();
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDialogs();
  }, []);

  const loadDialogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await dialogsApi.getPublishedDialogs();

      // Check if it's an error response
      if ("statusCode" in response && response.statusCode >= 400) {
        const errorResponse = response as any;
        
        // Handle specific error cases
        // Note: We don't redirect to language select here - that's only done during login/registration
        // If language is missing, just show an error message
        if (response.statusCode === 400 && errorResponse.message?.includes("Language not selected")) {
          setError("Please select a language in your profile to view dialogs");
          toast.warning("Please select a language in your profile");
          setDialogs([]);
          return;
        }
        
        setError(errorResponse.message || "Failed to load dialogs");
        toast.error(errorResponse.message || "Failed to load dialogs");
        setDialogs([]);
        return;
      }

      // Response structure: {data: Dialog[], count: number}
      const dialogsResponse = response as { data: Dialog[]; count: number };
      
      if (!dialogsResponse.data || !Array.isArray(dialogsResponse.data)) {
        setError("Invalid response format");
        setDialogs([]);
        return;
      }

      setDialogs(dialogsResponse.data);
      
      if (dialogsResponse.data.length === 0) {
        toast.info("No dialogs available for your selected language");
      }
    } catch (error: any) {
      console.error("Load dialogs error:", error);
      setError("An error occurred while loading dialogs");
      toast.error("An error occurred while loading dialogs");
      setDialogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
        Dialogs
      </h1>
      <p className="text-secondary-600 dark:text-secondary-400 mb-6">
        Browse and practice with interactive dialogs
      </p>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="ml-4 text-secondary-600 dark:text-secondary-400">
            Loading dialogs...
          </p>
        </div>
      ) : error ? (
        <div className="card p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadDialogs}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : dialogs.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-secondary-600 dark:text-secondary-400">
            No dialogs available for your selected language at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dialogs.map((dialog) => (
            <Link
              key={dialog.id}
              href={ROUTES.DASHBOARD.DIALOG_DETAILS(dialog.id)}
              className="card card-hover p-6 block h-full flex flex-col"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-white flex-1 pr-2">
                  {dialog.title}
                </h2>
                {/* Only show Free/Premium labels if user doesn't have active membership */}
                {hasActiveMembership !== true && (
                  dialog.isFree ? (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded flex-shrink-0">
                      Free
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded flex-shrink-0">
                      Premium
                    </span>
                  )
                )}
              </div>
              {dialog.description && (
                <p className="text-secondary-600 dark:text-secondary-400 line-clamp-3 flex-1">
                  {dialog.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


