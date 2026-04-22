<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the ZenOTA Next.js App Router frontend. The setup includes client-side initialization via `instrumentation-client.ts`, a server-side PostHog client in `src/lib/posthog-server.ts`, a reverse proxy configuration in `next.config.ts`, and event tracking across all key user flows: authentication, deployments, API key management, subscription changes, billing, and account deletion. Users are identified on login and signup, and PostHog is reset on logout and account deletion.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account via email/password | `src/app/register/page.tsx` |
| `user_signed_up_with_google` | User initiated Google OAuth sign-up flow | `src/app/register/page.tsx` |
| `user_logged_in` | User successfully logged in via email/password | `src/app/login/page.tsx` |
| `user_logged_in_with_google` | User initiated Google OAuth sign-in flow | `src/app/login/page.tsx` |
| `user_logged_out` | User clicked the logout button from the dashboard navbar | `src/app/dashboard/components/Navbar.tsx` |
| `deployment_uploaded` | User successfully uploaded an OTA update bundle | `src/app/dashboard/page.tsx` |
| `deployment_deleted` | User confirmed deletion of a deployment/update | `src/app/dashboard/page.tsx` |
| `api_key_generated` | User successfully generated a new CLI API key | `src/app/dashboard/page.tsx` |
| `api_key_deleted` | User confirmed deletion of an API key | `src/app/dashboard/page.tsx` |
| `plan_upgraded` | User successfully upgraded to the Pro subscription plan | `src/app/dashboard/components/SubscriptionView.tsx` |
| `plan_downgraded` | User confirmed downgrade from Pro to Hobby plan | `src/app/dashboard/components/SubscriptionView.tsx` |
| `invoice_downloaded` | User downloaded a billing invoice PDF | `src/app/dashboard/components/BillingView.tsx` |
| `account_deleted` | User confirmed permanent deletion of their account | `src/app/dashboard/components/SettingsView.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/393180/dashboard/1498657)
- **Insight**: [Signup & Login Funnel](https://us.posthog.com/project/393180/insights/YV2Tua0h) — Conversion funnel from signup → login → first deployment
- **Insight**: [New Signups Over Time](https://us.posthog.com/project/393180/insights/Ff1sWCCY) — Daily registrations broken down by email vs. Google
- **Insight**: [Pro Plan Upgrade Conversion](https://us.posthog.com/project/393180/insights/JmnMYNjX) — Funnel from signup → deployment → Pro upgrade
- **Insight**: [Deployments Over Time](https://us.posthog.com/project/393180/insights/ZejVMIdG) — Daily OTA deployment activity
- **Insight**: [Churn Events](https://us.posthog.com/project/393180/insights/r3ghkzjI) — Plan downgrades and account deletions over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
