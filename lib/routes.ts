export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },
  DASHBOARD: {
    HOME: "/dashboard",
    PROFILE: "/dashboard/profile",
    SETTINGS: "/dashboard/settings",
    DIALOGS: "/dashboard/dialogs",
    DIALOG_DETAILS: (id: string) => `/dashboard/dialogs/${id}`,
    PRACTICE: "/dashboard/practice",
    PAYMENTS: "/dashboard/payments",
    PREMIUM: "/dashboard/payments", // Alias for payments
  },
  SELECT_LANGUAGE: "/select-language",
} as const;


