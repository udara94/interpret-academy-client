"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const features = [
  {
    icon: "📚",
    title: "Free Dialogs",
    description:
      "Access a collection of free dialogs to practice your interpretation skills",
    highlight: "Available for everyone",
  },
  {
    icon: "🌍",
    title: "Multi-Language Support",
    description:
      "Pick your preferred language and change it anytime. Support for multiple languages",
    highlight: "Flexible learning",
  },
  {
    icon: "👤",
    title: "Personal Profile",
    description:
      "Manage your profile, track your progress, and customize your learning experience",
    highlight: "Your journey",
  },
  {
    icon: "💎",
    title: "Premium Subscription",
    description:
      "Subscribe to unlock exclusive resources, advanced practice modes, and more content",
    highlight: "Unlock everything",
  },
  {
    icon: "⏰",
    title: "Time-Based Access",
    description:
      "Access resources based on your subscription plan with specific time allocations",
    highlight: "Fair usage",
  },
  {
    icon: "📂",
    title: "Category Organization",
    description:
      "Browse dialogs organized by categories for easy navigation and focused learning",
    highlight: "Organized content",
  },
  {
    icon: "📝",
    title: "Exam Mode Practice",
    description:
      "Subscribed users can practice dialogs in exam mode for realistic test preparation",
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
    <div className="min-h-screen bg-gradient-to-r from-[#e3e5e6] to-[#ede0b0] dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      {/* Hero Section */}
      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold md:text-6xl text-secondary-900 dark:text-white">
            Welcome to{" "}
            <span className="text-transparent bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text">
              Interpret Academy
            </span>
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-secondary-700 dark:text-secondary-300">
            Master interpretation skills through interactive dialogs, practice
            sessions, and comprehensive learning resources
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={handleGetStarted}
              className="px-8 py-3 font-medium text-white transition-all duration-200 rounded-lg shadow-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 hover:shadow-xl"
            >
              Get Started Free
            </button>
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="px-8 py-3 font-medium transition-colors duration-200 bg-white border-2 rounded-lg dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-900 dark:text-white border-primary-300 dark:border-primary-600"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-secondary-900 dark:text-white">
            Everything You Need to Excel
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-secondary-700 dark:text-secondary-300">
            Discover all the features that make Interpret Academy the perfect
            platform for interpretation learning
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="p-8 card card-hover">
              <div className="mb-4 text-5xl">{feature.icon}</div>
              <div className="mb-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full text-primary-700 dark:text-primary-400 bg-gradient-to-r from-primary-100 to-primary-200 dark:bg-primary-900">
                  {feature.highlight}
                </span>
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-secondary-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mb-6 text-secondary-700 dark:text-secondary-300">
                {feature.description}
              </p>
              <button
                onClick={handleFeatureClick}
                className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 group"
              >
                Get Started
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features Highlight */}
      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-12 text-center text-white shadow-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 dark:from-primary-700 dark:via-primary-800 dark:to-primary-900 rounded-2xl">
          <h2 className="mb-4 text-4xl font-bold">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-primary-100 dark:text-primary-200">
            Join thousands of students improving their interpretation skills.
            Start with free dialogs or unlock premium features with a
            subscription.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={handleGetStarted}
              className="px-8 py-3 font-medium transition-colors duration-200 bg-white rounded-lg shadow-lg text-primary-600 hover:bg-primary-50"
            >
              Create Free Account
            </button>
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="px-8 py-3 font-medium text-white transition-colors duration-200 bg-transparent border-2 border-white rounded-lg hover:bg-white/10"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Categories */}
      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="p-8 card card-hover">
            <h3 className="mb-4 text-2xl font-bold text-secondary-900 dark:text-white">
              🆓 Free Features
            </h3>
            <ul className="space-y-3 text-secondary-700 dark:text-secondary-300">
              <li className="flex items-center">
                <span className="mr-2 text-primary-600 dark:text-primary-400">
                  ✓
                </span>
                Access free dialogs
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary-600 dark:text-primary-400">
                  ✓
                </span>
                Browse categories
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary-600 dark:text-primary-400">
                  ✓
                </span>
                Language selection
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary-600 dark:text-primary-400">
                  ✓
                </span>
                Basic profile management
              </li>
            </ul>
          </div>

          <div className="p-8 border-2 card card-elevated bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 dark:from-primary-900 dark:via-primary-800 dark:to-primary-700 border-primary-300 dark:border-primary-700">
            <h3 className="mb-4 text-2xl font-bold text-secondary-900 dark:text-white">
              💎 Premium Features
            </h3>
            <ul className="space-y-3 text-secondary-800 dark:text-secondary-200">
              <li className="flex items-center">
                <span className="mr-2 text-primary-600 dark:text-primary-400">
                  ✓
                </span>
                Unlimited access to all dialogs
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary-600 dark:text-primary-400">
                  ✓
                </span>
                Exam mode practice
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary-600 dark:text-primary-400">
                  ✓
                </span>
                Extended time allocations
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary-600 dark:text-primary-400">
                  ✓
                </span>
                Advanced analytics
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-primary-600 dark:text-primary-400">
                  ✓
                </span>
                Priority support
              </li>
            </ul>
            <button
              onClick={handleGetStarted}
              className="w-full px-6 py-3 mt-6 font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-secondary-900 dark:text-white">
            Start Learning Today
          </h2>
          <p className="mb-8 text-secondary-700 dark:text-secondary-300">
            No credit card required. Get started with free features and upgrade
            anytime.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-12 py-4 text-lg font-medium text-white transition-all duration-200 rounded-lg shadow-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 hover:shadow-xl"
          >
            Create Your Free Account
          </button>
        </div>
      </div>
    </div>
  );
}
