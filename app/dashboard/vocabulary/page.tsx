"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { wordCategoriesApi, WordCategory } from "@/lib/api/word-categories-api";
import Link from "next/link";

export default function VocabularyPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<WordCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "free" | "paid">("all");

  useEffect(() => {
    loadCategories();
  }, [filter]);

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isFree = filter === "free" ? true : filter === "paid" ? false : undefined;
      const response = await wordCategoriesApi.getWordCategories(isFree);

      // Check if it's an error response
      if ("statusCode" in response && response.statusCode >= 400) {
        const errorResponse = response as any;
        setError(errorResponse.message || "Failed to load categories");
        toast.error(errorResponse.message || "Failed to load categories");
        setCategories([]);
        return;
      }

      // Response structure: {data: WordCategory[], count: number}
      const categoriesResponse = response as { data: WordCategory[]; count: number };
      
      if (!categoriesResponse.data || !Array.isArray(categoriesResponse.data)) {
        setError("Invalid response format");
        setCategories([]);
        return;
      }

      setCategories(categoriesResponse.data);
      
      if (categoriesResponse.data.length === 0) {
        toast.info("No categories available");
      }
    } catch (error: any) {
      console.error("Load categories error:", error);
      setError(error.message || "An error occurred while loading categories");
      toast.error(error.message || "An error occurred while loading categories");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
        Vocabulary
      </h1>
      <p className="text-secondary-600 dark:text-secondary-400 mb-6">
        Browse and learn vocabulary by category
      </p>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all"
              ? "bg-primary-600 text-white"
              : "bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
          }`}
        >
          All Categories
        </button>
        <button
          onClick={() => setFilter("free")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "free"
              ? "bg-primary-600 text-white"
              : "bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
          }`}
        >
          Free
        </button>
        <button
          onClick={() => setFilter("paid")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "paid"
              ? "bg-primary-600 text-white"
              : "bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
          }`}
        >
          Paid
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="ml-4 text-secondary-600 dark:text-secondary-400">
            Loading categories...
          </p>
        </div>
      ) : error ? (
        <div className="card p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadCategories}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : categories.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-secondary-600 dark:text-secondary-400">
            No categories available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/dashboard/vocabulary/${category.id}`}
                className="card card-hover p-6 block h-full flex flex-col"
                onClick={() => {
                  // Category click will navigate to details page
                }}
              >
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-white flex-1 pr-2">
                  {category.category}
                </h2>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded flex-shrink-0 ${
                    category.isFree
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                  }`}
                >
                  {category.isFree ? "Free" : "Paid"}
                </span>
              </div>
              {category.description && (
                <p className="text-secondary-600 dark:text-secondary-400 line-clamp-3 flex-1">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

