"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { wordsApi, WordWithInterpretation } from "@/lib/api/words-api";
import { wordCategoriesApi, WordCategory } from "@/lib/api/word-categories-api";
import { useMembership } from "@/lib/hooks/use-membership";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import PremiumAccessModal from "@/components/ui/PremiumAccessModal";

export default function CategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { hasActiveMembership } = useMembership();
  const categoryId = params?.id as string;

  const [category, setCategory] = useState<WordCategory | null>(null);
  const [words, setWords] = useState<WordWithInterpretation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    if (categoryId) {
      loadCategory();
    }
  }, [categoryId, hasActiveMembership]);

  // Only load words if category is loaded and user has access
  useEffect(() => {
    if (category && !showPremiumModal && (category.isFree || hasActiveMembership)) {
      loadWords();
    }
  }, [category, showPremiumModal, hasActiveMembership]);

  const loadCategory = async () => {
    setIsLoading(true);
    
    try {
      const response = await wordCategoriesApi.getWordCategoryById(categoryId);

      if ("statusCode" in response && response.statusCode >= 400) {
        const errorResponse = response as any;
        setError(errorResponse.message || "Failed to load category");
        toast.error(errorResponse.message || "Failed to load category");
        setCategory(null);
        setIsLoading(false);
        return;
      }

      const categoryData = response as WordCategory;
      setCategory(categoryData);

      // Check if user needs premium access
      // Only show modal if category is premium AND user doesn't have active membership
      if (!categoryData.isFree && !hasActiveMembership) {
        setShowPremiumModal(true);
        setIsLoading(false);
        return;
      }

      // If user has access, continue to load words
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error loading category:", error);
      setError("An error occurred while loading the category");
      toast.error("Failed to load category");
      setCategory(null);
      setIsLoading(false);
    }
  };

  const loadWords = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await wordsApi.getWordsWithInterpretations(categoryId);

      // Check if it's an error response
      if ("statusCode" in response && response.statusCode >= 400) {
        const errorResponse = response as any;

        // Handle specific error cases
        if (response.statusCode === 400 && errorResponse.message?.includes("Language not selected")) {
          // Note: We don't redirect to language select here - that's only done during login/registration
          // If language is missing, just show an error message
          setError("Please select a language in your profile to view vocabulary");
          toast.warning("Please select a language in your profile");
          return;
        }

        setError(errorResponse.message || "Failed to load words");
        toast.error(errorResponse.message || "Failed to load words");
        setWords([]);
        return;
      }

      // Response structure: {data: WordWithInterpretation[], count: number}
      const wordsResponse = response as { data: WordWithInterpretation[]; count: number };

      if (!wordsResponse.data || !Array.isArray(wordsResponse.data)) {
        setError("Invalid response format");
        setWords([]);
        return;
      }

      setWords(wordsResponse.data);

      if (wordsResponse.data.length === 0) {
        toast.info("No words available in this category");
      }
    } catch (error: any) {
      console.error("Load words error:", error);
      setError(error.message || "An error occurred while loading words");
      toast.error(error.message || "An error occurred while loading words");
      setWords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowPremiumModal(false);
    router.push("/dashboard/vocabulary");
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 pt-20">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="ml-4 text-secondary-600 dark:text-secondary-400">
            Loading category...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 pt-20">
      <PremiumAccessModal
        isOpen={showPremiumModal}
        onClose={handleCloseModal}
        dialogTitle={category?.category}
        contentType="vocabulary"
      />
      
      {!showPremiumModal && (
        <>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/vocabulary"
          className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors mb-4 inline-block"
        >
          ← Back to Vocabulary
        </Link>
        {category && (
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
              {category.category}
            </h1>
            {category.description && (
              <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                {category.description}
              </p>
            )}
            <span
              className={`px-3 py-1 text-sm font-semibold rounded ${
                category.isFree
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
              }`}
            >
              {category.isFree ? "Free" : "Paid"}
            </span>
          </div>
        )}
      </div>

      {/* Error State */}
      {error ? (
        <div className="card p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadWords}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : words.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-secondary-600 dark:text-secondary-400">
            No words available in this category at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((word, index) => (
            <div
              key={word.id}
              className="card card-hover p-6 flex flex-col h-full group relative overflow-hidden"
            >
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200/20 to-primary-400/10 dark:from-primary-800/20 dark:to-primary-600/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              
              {/* Word number badge */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-primary-500/20 dark:bg-primary-400/20 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300">
                {index + 1}
              </div>

              <div className="flex-1 flex flex-col relative z-10">
                {/* English Word */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
                      English
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {word.word}
                  </h3>
                </div>

                {/* Interpretations */}
                {word.interpretations.length > 0 ? (
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
                        Translation
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-secondary-300 to-transparent dark:from-secondary-600"></div>
                    </div>
                    <div className="space-y-2">
                      {word.interpretations.map((interpretation) => (
                        <div
                          key={interpretation.id}
                          className="bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/30 dark:to-primary-800/20 border-l-4 border-primary-500 dark:border-primary-400 rounded-r-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <span className="text-lg font-semibold text-secondary-900 dark:text-white">
                            {interpretation.interpretedWord}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2 opacity-50">📝</div>
                      <p className="text-secondary-500 dark:text-secondary-500 italic text-sm">
                        No translation available
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}

