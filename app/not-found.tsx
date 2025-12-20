import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-white via-primary-50 to-primary-100 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      {/* Background Gear Icons */}
      <div className="absolute right-20 top-1/4 opacity-20">
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-secondary-400"
        >
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      <div className="absolute right-40 top-1/3 opacity-15">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-secondary-400"
        >
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>

      <div className="relative z-10 text-center">
        {/* Large ERROR Text */}
        <div className="relative mb-8">
          <h1 className="text-[180px] md:text-[240px] font-black text-primary-500 leading-none tracking-tight">
            ERROR
          </h1>

          {/* Character holding 404 sign - positioned on top of ERROR */}
          <div className="absolute top-0 transform -translate-x-1/2 -translate-y-16 left-1/2">
            <svg
              width="220"
              height="140"
              viewBox="0 0 220 140"
              className="drop-shadow-lg"
            >
              {/* Character body (lying horizontally) - improved shape */}
              <ellipse
                cx="110"
                cy="70"
                rx="40"
                ry="22"
                fill="white"
                stroke="#2a251f"
                strokeWidth="2.5"
              />
              {/* Head - slightly larger */}
              <circle
                cx="110"
                cy="45"
                r="18"
                fill="white"
                stroke="#2a251f"
                strokeWidth="2.5"
              />
              {/* Hair - more defined */}
              <path
                d="M 95 32 Q 110 25 125 32"
                stroke="#2a251f"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              {/* Eyes */}
              <circle cx="105" cy="42" r="2" fill="#2a251f" />
              <circle cx="115" cy="42" r="2" fill="#2a251f" />
              {/* Mouth - slight smile */}
              <path
                d="M 105 50 Q 110 53 115 50"
                stroke="#2a251f"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              {/* Arms - more expressive */}
              <line
                x1="75"
                y1="65"
                x2="90"
                y2="58"
                stroke="#2a251f"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                x1="145"
                y1="58"
                x2="160"
                y2="65"
                stroke="#2a251f"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Hands */}
              <circle cx="90" cy="58" r="4" fill="#2a251f" />
              <circle cx="160" cy="65" r="4" fill="#2a251f" />
              {/* Legs - more defined */}
              <line
                x1="90"
                y1="88"
                x2="90"
                y2="110"
                stroke="#2a251f"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                x1="130"
                y1="88"
                x2="130"
                y2="110"
                stroke="#2a251f"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Feet */}
              <ellipse cx="90" cy="110" rx="6" ry="4" fill="#2a251f" />
              <ellipse cx="130" cy="110" rx="6" ry="4" fill="#2a251f" />
              {/* 404 Sign - improved with theme colors */}
              <rect
                x="135"
                y="30"
                width="65"
                height="42"
                fill="#fbbf24"
                stroke="#78350f"
                strokeWidth="2.5"
                rx="5"
                className="drop-shadow-md"
              />
              <text
                x="167.5"
                y="58"
                textAnchor="middle"
                fontSize="26"
                fontWeight="bold"
                fill="#78350f"
                fontFamily="system-ui, sans-serif"
              >
                404
              </text>
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="mt-8 mb-8">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl text-secondary-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="max-w-md mx-auto mb-8 text-lg text-secondary-600 dark:text-secondary-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="px-6 py-3 font-medium text-white transition-colors duration-200 rounded-lg shadow-lg bg-primary-500 hover:bg-primary-600 hover:shadow-xl"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="px-6 py-3 font-medium transition-colors duration-200 border-2 rounded-lg bg-white/60 dark:bg-secondary-800/60 hover:bg-white/80 dark:hover:bg-secondary-800/80 text-secondary-900 dark:text-white border-primary-300 dark:border-primary-600 backdrop-blur-sm"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
