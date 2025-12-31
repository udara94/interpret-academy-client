"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession, getSession } from "next-auth/react";
import { languagesApi, Language } from "@/lib/api/languages-api";
import { profileApi } from "@/lib/api/profile-api";
import { authApi } from "@/lib/api/auth-api";
import { ROUTES } from "@/lib/routes";

export default function SelectLanguagePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    setIsLoading(true);
    try {
      const response = await languagesApi.getLanguages();

      // Check if it's an error response
      if ("statusCode" in response && response.statusCode >= 400) {
        const errorResponse = response as any;
        toast.error(errorResponse.message || "Failed to load languages");
        setLanguages([]);
        return;
      }

      // Response structure: {statusCode: 200, data: {data: [...], count: 2}}
      const languagesResponse = response as any;
      
      // Extract the languages array
      let languagesData: Language[] = [];
      
      // Check if response has statusCode (BaseResponse format)
      if ("statusCode" in languagesResponse && languagesResponse.statusCode === 200) {
        // Response is: {statusCode: 200, data: {data: [...], count: 2}}
        if (languagesResponse.data?.data && Array.isArray(languagesResponse.data.data)) {
          languagesData = languagesResponse.data.data;
        } else if (Array.isArray(languagesResponse.data)) {
          // Fallback: data is directly an array
          languagesData = languagesResponse.data;
        }
      } else if (languagesResponse.data) {
        // Direct LanguagesResponse format: {data: [...], count: 2}
        if (Array.isArray(languagesResponse.data)) {
          languagesData = languagesResponse.data;
        } else if (languagesResponse.data.data && Array.isArray(languagesResponse.data.data)) {
          languagesData = languagesResponse.data.data;
        }
      } else if (Array.isArray(languagesResponse)) {
        // Response is directly an array
        languagesData = languagesResponse;
      }
      
      if (!Array.isArray(languagesData) || languagesData.length === 0) {
        toast.warning("No languages available. Please contact support.");
      }
      
      setLanguages(languagesData);
    } catch (error) {
      toast.error("An error occurred while loading languages");
      setLanguages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedLanguageId) {
      toast.error("Please select a language");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await profileApi.updateLanguage(selectedLanguageId);

      if ("statusCode" in response && response.statusCode >= 200 && response.statusCode < 300) {
        toast.success("Language selected successfully!");
        
        // Get updated user data from API to verify the update
        let languageUpdated = false;
        try {
          const profileResponse = await profileApi.getProfile();
          
          if ("statusCode" in profileResponse && profileResponse.statusCode === 200) {
            const baseResponse = profileResponse as any;
            const updatedUser = baseResponse.data;
            
            if (!updatedUser.languageId) {
              toast.error("Language update may have failed. Please try again.");
              setIsSubmitting(false);
              return;
            }
            languageUpdated = true;
          }
        } catch (error) {
          console.error("Error verifying language update:", error);
          // Continue - we'll try to update session anyway
        }
        
        // Update the session to refresh user data including languageId
        // This triggers the JWT callback with trigger === "update" which will refresh the token
        // For new users, we need to wait for the session to actually update
        if (languageUpdated) {
          try {
            await update();
            
            // Wait a bit and verify session was updated
            // This is especially important for new users
            let attempts = 0;
            const maxAttempts = 5;
            while (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 300));
              const updatedSession = await getSession();
              
              if (updatedSession?.user?.languageId) {
                // Session updated successfully
                router.push(ROUTES.DASHBOARD.HOME);
                router.refresh();
                return;
              }
              attempts++;
            }
            
            // If session still doesn't have languageId after retries, 
            // redirect anyway (the backend has the languageId)
            router.push(ROUTES.DASHBOARD.HOME);
            router.refresh();
          } catch (error) {
            console.error("Error updating session:", error);
            // Continue anyway - the language was updated in the backend
            router.push(ROUTES.DASHBOARD.HOME);
            router.refresh();
          }
        } else {
          // If we couldn't verify, still try to update and redirect
          try {
            await update();
          } catch (error) {
            console.error("Error updating session:", error);
          }
          setTimeout(() => {
            router.push(ROUTES.DASHBOARD.HOME);
            router.refresh();
          }, 1000);
        }
      } else {
        const errorResponse = response as any;
        toast.error(errorResponse.message || "Failed to update language");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#e3e5e6] to-[#ede0b0] dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 flex items-center justify-center p-4">
      <div className="card card-elevated w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
            Select Your Language
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Choose your preferred language to get started
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-secondary-600 dark:text-secondary-300">Loading languages...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              {languages.length === 0 ? (
                <div className="text-center py-8 text-secondary-600 dark:text-secondary-300">
                  No languages available
                </div>
              ) : (
                languages.map((language) => (
                  <label
                    key={language.id}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedLanguageId === language.id
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                        : "border-secondary-300 dark:border-secondary-600 hover:border-primary-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="language"
                      value={language.id}
                      checked={selectedLanguageId === language.id}
                      onChange={(e) => setSelectedLanguageId(e.target.value)}
                      className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-secondary-900 dark:text-white">
                        {language.name}
                      </div>
                      <div className="text-sm text-secondary-500 dark:text-secondary-400">
                        {language.code.toUpperCase()}
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>

            <button
              type="submit"
              disabled={!selectedLanguageId || isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

