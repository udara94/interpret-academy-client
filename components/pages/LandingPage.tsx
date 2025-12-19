"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const features = [
  {
    icon: "📚",
    title: "Free Dialogs",
    description: "Access a collection of free dialogs to practice your interpretation skills",
    highlight: "Available for everyone",
  },
  {
    icon: "🌍",
    title: "Multi-Language Support",
    description: "Pick your preferred language and change it anytime. Support for multiple languages",
    highlight: "Flexible learning",
  },
  {
    icon: "👤",
    title: "Personal Profile",
    description: "Manage your profile, track your progress, and customize your learning experience",
    highlight: "Your journey",
  },
  {
    icon: "💎",
    title: "Premium Subscription",
    description: "Subscribe to unlock exclusive resources, advanced practice modes, and more content",
    highlight: "Unlock everything",
  },
  {
    icon: "⏰",
    title: "Time-Based Access",
    description: "Access resources based on your subscription plan with specific time allocations",
    highlight: "Fair usage",
  },
  {
    icon: "📂",
    title: "Category Organization",
    description: "Browse dialogs organized by categories for easy navigation and focused learning",
    highlight: "Organized content",
  },
  {
    icon: "📝",
    title: "Exam Mode Practice",
    description: "Subscribed users can practice dialogs in exam mode for realistic test preparation",
    highlight: "Premium feature",
  },
];

export default function LandingPage() {
  const handleGetStarted = () => {
    // Navigate to register page
    window.location.href = ROUTES.AUTH.REGISTER;
  };

  const handleFeatureClick = () => {
    // Navigate to login page
    window.location.href = ROUTES.AUTH.LOGIN;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 dark:text-white mb-6">
            Welcome to{" "}
            <span className="text-primary-600 dark:text-primary-400">
              Interpret Academy
            </span>
          </h1>
          <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8 max-w-2xl mx-auto">
            Master interpretation skills through interactive dialogs, practice sessions, and comprehensive learning resources
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </button>
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700 text-secondary-900 dark:text-white font-medium py-3 px-8 rounded-lg border-2 border-secondary-300 dark:border-secondary-600 transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 dark:text-white mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            Discover all the features that make Interpret Academy the perfect platform for interpretation learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-secondary-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border border-secondary-200 dark:border-secondary-700"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <div className="mb-2">
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 px-2 py-1 rounded-full">
                  {feature.highlight}
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-secondary-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {feature.description}
              </p>
              <button
                onClick={handleFeatureClick}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm flex items-center group"
              >
                Get Started
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features Highlight */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-primary-100 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of students improving their interpretation skills. Start with free dialogs or unlock premium features with a subscription.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Create Free Account
            </button>
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white dark:bg-secondary-800 p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
              🆓 Free Features
            </h3>
            <ul className="space-y-3 text-secondary-600 dark:text-secondary-400">
              <li className="flex items-center">
                <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                Access free dialogs
              </li>
              <li className="flex items-center">
                <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                Browse categories
              </li>
              <li className="flex items-center">
                <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                Language selection
              </li>
              <li className="flex items-center">
                <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                Basic profile management
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 p-8 rounded-xl shadow-lg border-2 border-primary-200 dark:border-primary-700">
            <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
              💎 Premium Features
            </h3>
            <ul className="space-y-3 text-secondary-700 dark:text-secondary-300">
              <li className="flex items-center">
                <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                Unlimited access to all dialogs
              </li>
              <li className="flex items-center">
                <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                Exam mode practice
              </li>
              <li className="flex items-center">
                <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                Extended time allocations
              </li>
              <li className="flex items-center">
                <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                Advanced analytics
              </li>
              <li className="flex items-center">
                <span className="text-primary-600 dark:text-primary-400 mr-2">✓</span>
                Priority support
              </li>
            </ul>
            <button
              onClick={handleGetStarted}
              className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
            Start Learning Today
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-8">
            No credit card required. Get started with free features and upgrade anytime.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-4 px-12 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Create Your Free Account
          </button>
        </div>
      </div>
    </div>
  );
}


