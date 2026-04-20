export const PLAN_LIMITS = {
  FREE: {
    maxApps: 1,
    maxDeploymentsPerDay: 2,
    maxApiKeys: 1,
    maxDownloadsPerMonth: 1000,
  },
  PRO: {
    maxApps: -1, // Unlimited
    maxDeploymentsPerDay: -1, // Unlimited
    maxApiKeys: -1, // Unlimited
    maxDownloadsPerMonth: 100000,
  },
};

export const PRO_PRICE = 19; // USD/month
export const TRIAL_DURATION_DAYS = 30;
