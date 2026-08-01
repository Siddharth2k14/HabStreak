# HabStreak — Git Branching & Feature Breakdown Plan

## 1. Branch Hierarchy (as you defined)

```
main
 └── develop
      └── feature/<feature-name>
           └── <feature-name>/<task-name>   (specific/task branch)
```

**Naming convention used below**
- Feature branch: `feature/<feature-name>`
- Task branch (branched off the feature branch): `feature/<feature-name>-<task>`

Example: `feature/auth` → `feature/auth-login-page`

**Flow for every task:**
1. Branch `feature/<feature-name>-<task>` off `feature/<feature-name>`
2. Build + unit-test the task → PR into `feature/<feature-name>`
3. Once all tasks for that feature are merged and the feature is tested as a whole → PR into `develop`
4. Once `develop` is integration-tested with other features → PR into `main`

---

## 2. Recommended Build Order (dependency-aware)

Some features are "foundation" — everything else imports from them. Build/merge these first, then the independent verticals can be built in parallel (even by different people).

```
1. foundation        (blocks everything)
2. theme-and-styles   (blocks everything visual)
3. shared-ui-kit      (blocks all pages)
4. layouts            (blocks all pages)
5. feedback-states    (blocks all pages)
6. core-services      (blocks all API-calling features)
7. redux-store-setup  (blocks all features with a slice)
8. routing            (blocks navigation between features)
9. global-hooks-utils (blocks most features)
─── parallel from here ───
10. auth
11. habits
12. analytics
13. profile
14. settings
```

---

## 3. Feature Branches → Task Branches → Files

### `feature/foundation`
Project scaffolding everything else depends on.

| Task branch | Files/Folders |
|---|---|
| `foundation-project-setup` | `public/`, `vite.config.ts`, `tsconfig.json`, `package.json`, `.env`, `.env.development`, `.env.production`, `.eslintrc.cjs`, `.prettierrc`, `README.md` |
| `foundation-app-bootstrap` | `src/app/App.tsx`, `src/app/main.tsx`, `src/app/AppProviders.tsx`, `src/vite-env.d.ts` |
| `foundation-config` | `src/config/env.ts`, `src/config/appConfig.ts` |
| `foundation-constants` | `src/constants/api.ts`, `colors.ts`, `messages.ts`, `regex.ts`, `routes.ts`, `theme.ts` |
| `foundation-global-types` | `src/types/api.ts`, `auth.ts`, `habit.ts`, `analytics.ts`, `user.ts`, `common.ts` |

### `feature/theme-and-styles`
| Task branch | Files/Folders |
|---|---|
| `theme-palette-typography` | `theme/palette.ts`, `theme/typography.ts` |
| `theme-components-spacing` | `theme/components.ts`, `theme/shadows.ts`, `theme/spacing.ts`, `theme/breakpoints.ts`, `theme/index.ts` |
| `theme-global-css` | `styles/globals.css`, `styles/variables.css`, `styles/animations.css` |
| `theme-provider` | `providers/ThemeProvider.tsx` |

### `feature/shared-ui-kit`
| Task branch | Files/Folders |
|---|---|
| `ui-kit-buttons-cards` | `components/ui/AppButton/`, `components/ui/AppCard/` |
| `ui-kit-dialogs-drawers` | `components/ui/AppDialog/`, `components/ui/AppDrawer/` |
| `ui-kit-feedback-elements` | `components/ui/AppLoader/`, `AppSkeleton/`, `AppSnackbar/`, `AppTooltip/` |
| `ui-kit-inputs-misc` | `components/ui/AppTextField/`, `AppAvatar/`, `AppChip/` |
| `ui-kit-barrel-export` | `components/ui/index.ts` |

### `feature/layouts`
| Task branch | Files/Folders |
|---|---|
| `layouts-navbar-sidebar` | `components/layouts/Navbar/`, `components/layouts/Sidebar/` |
| `layouts-dashboard-auth` | `components/layouts/DashboardLayout/`, `components/layouts/AuthLayout/` |
| `layouts-footer` | `components/layouts/Footer/`, `components/layouts/index.ts` |

### `feature/feedback-states`
| Task branch | Files/Folders |
|---|---|
| `feedback-empty-error-states` | `components/feedback/EmptyState/`, `components/feedback/ErrorState/` |
| `feedback-error-boundary` | `components/feedback/ErrorBoundary/` |
| `feedback-network-notfound` | `components/feedback/NetworkError/`, `components/feedback/NotFound/`, `components/feedback/index.ts` |

### `feature/core-services`
| Task branch | Files/Folders |
|---|---|
| `services-axios-setup` | `services/api/axios.ts` |
| `services-interceptors` | `services/api/interceptors.ts` |
| `services-error-handling` | `services/api/ApiError.ts`, `services/api/ErrorHandler.ts`, `services/api/ResponseMapper.ts` |

### `feature/redux-store-setup`
| Task branch | Files/Folders |
|---|---|
| `store-root-reducer` | `store/index.ts`, `store/rootReducer.ts` |
| `store-middleware` | `store/middleware.ts` |
| `store-typed-hooks` | `store/hooks.ts` |
| `store-provider` | `providers/ReduxProvider.tsx` |

### `feature/routing`
| Task branch | Files/Folders |
|---|---|
| `routing-config` | `routes/routeConfig.ts` |
| `routing-guards` | `routes/ProtectedRoute.tsx`, `routes/PublicRoute.tsx` |
| `routing-app-routes` | `routes/AppRoutes.tsx` |

### `feature/global-hooks-utils`
| Task branch | Files/Folders |
|---|---|
| `utils-date-timezone` | `utils/date.ts`, `utils/timezone.ts` |
| `utils-formatters-validators` | `utils/formatters.ts`, `utils/validators.ts` |
| `utils-storage-error` | `utils/storage.ts`, `utils/error.ts` |
| `utils-streak-analytics` | `utils/streak.ts`, `utils/analytics.ts` |
| `hooks-common` | `hooks/useDebounce.ts`, `usePrevious.ts`, `useTimezone.ts`, `useWindowSize.ts` |
| `provider-misc` | `providers/SnackbarProvider.tsx`, `providers/LocalizationProvider.tsx` |

---

### `feature/auth`
| Task branch | Files/Folders |
|---|---|
| `auth-types-constants` | `features/auth/types/`, `features/auth/constants/` |
| `auth-validation` | `features/auth/validation/` |
| `auth-api` | `features/auth/api/` |
| `auth-redux-store` | `features/auth/store/authSlice.ts`, `authSelectors.ts`, `authThunks.ts` |
| `auth-hooks` | `features/auth/hooks/` |
| `auth-login-page` | `features/auth/pages/LoginPage.tsx`, related `components/` |
| `auth-register-page` | `features/auth/pages/RegisterPage.tsx`, related `components/` |
| `auth-barrel-export` | `features/auth/index.ts` |

### `feature/habits`
| Task branch | Files/Folders |
|---|---|
| `habits-types-validation` | `features/habits/types/`, `features/habits/validation/`, `features/habits/utils/` |
| `habits-constants` | `features/habits/constants/` |
| `habits-api` | `features/habits/api/` |
| `habits-redux-store` | `features/habits/store/habitSlice.ts`, `habitSelectors.ts`, `habitThunks.ts` |
| `habits-hooks` | `features/habits/hooks/` |
| `habits-card-list` | `components/HabitCard/`, `HabitList/` |
| `habits-toggle-stats` | `components/HabitToggle/`, `HabitStats/` |
| `habits-form-actions` | `components/HabitForm/`, `HabitActions/` |
| `habits-dashboard-page` | `features/habits/pages/DashboardPage.tsx` |
| `habits-history-page` | `features/habits/pages/HistoryPage.tsx` |
| `habits-barrel-export` | `features/habits/index.ts` |

### `feature/analytics`
| Task branch | Files/Folders |
|---|---|
| `analytics-types-utils` | `features/analytics/types/`, `features/analytics/utils/`, `features/analytics/config/` |
| `analytics-api` | `features/analytics/api/` |
| `analytics-redux-store` | `features/analytics/store/analyticsSlice.ts`, `analyticsSelectors.ts`, `analyticsThunks.ts` |
| `analytics-hooks` | `features/analytics/hooks/` |
| `analytics-statistics-cards` | `components/StatisticsCards/` |
| `analytics-completion-streak-charts` | `components/CompletionChart/`, `StreakChart/` |
| `analytics-heatmap` | `components/Heatmap/` |
| `analytics-monthly-insights` | `components/MonthlyTrend/`, `Insights/` |
| `analytics-page` | `features/analytics/pages/AnalyticsPage.tsx` |
| `analytics-barrel-export` | `features/analytics/index.ts` |

### `feature/profile`
| Task branch | Files/Folders |
|---|---|
| `profile-types-store` | `features/profile/types/`, `features/profile/store/` |
| `profile-api` | `features/profile/api/` |
| `profile-hooks` | `features/profile/hooks/` |
| `profile-components-page` | `features/profile/components/`, `features/profile/pages/ProfilePage.tsx` |
| `profile-barrel-export` | `features/profile/index.ts` |

### `feature/settings`
| Task branch | Files/Folders |
|---|---|
| `settings-types-store` | `features/settings/types/`, `features/settings/store/` |
| `settings-hooks` | `features/settings/hooks/` |
| `settings-components-page` | `features/settings/components/`, `features/settings/pages/SettingsPage.tsx` |
| `settings-barrel-export` | `features/settings/index.ts` |

---

## 4. Example Git Commands

```bash
# Start develop from main (once)
git checkout main
git checkout -b develop
git push -u origin develop

# Start a feature branch from develop
git checkout develop
git checkout -b feature/auth
git push -u origin feature/auth

# Start a task branch from the feature branch
git checkout feature/auth
git checkout -b feature/auth-login-page
git push -u origin feature/auth-login-page

# ... work, commit ...
git add .
git commit -m "feat(auth): build login page UI and form handling"
git push

# Merge task branch back into feature branch (via PR, after review/tests)
git checkout feature/auth
git merge --no-ff feature/auth-login-page
git push

# Once ALL auth task branches are merged and feature is tested,
# merge feature branch into develop (via PR)
git checkout develop
git merge --no-ff feature/auth
git push

# Once develop is integration-tested with all features,
# merge into main for release (via PR)
git checkout main
git merge --no-ff develop
git tag v1.0.0
git push --tags
git push
```

## 5. Suggested Rules

- Never commit directly to `main` or `develop` — always via PR.
- A task branch (`feature/<name>-<task>`) should touch **one folder/concern only**, so PRs stay small and reviewable.
- A feature branch (`feature/<name>`) is only merged to `develop` once it builds standalone, has no broken imports, and its own tests pass.
- Delete task branches after merging into the feature branch to keep the repo clean.
- Rebase task branches on their feature branch regularly to avoid painful merge conflicts.
