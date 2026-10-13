# Email Service Diagnosis

## Root Cause

The email transporter is initialized before the environment variables are loaded.

- `src/index.ts` calls `dotenv.config()` in its module body.
- ES module imports are evaluated before that body runs.
- `src/index.ts` statically imports the routes, which import `auth.controller.ts`, which imports `email.service.ts`, which imports `config/email.config.ts`.
- `config/email.config.ts` therefore calls `nodemailer.createTransport()` while the SMTP environment variables are still unset.

The transporter keeps those initial values, so loading dotenv later does not repair it. The non-sending check confirmed that the transporter has SMTP settings when dotenv is loaded first, but the import order in the application does not do that.

## Additional Configuration Error

The service uses:

```ts
process.env.EMAIL_FROM
```

but `backend/.env` defines `EMAIL_FORM`. As a result, the `from` address is generated with an undefined sender value even after the transporter initialization order is fixed.

## Evidence

- `backend/config/email.config.ts` reads `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASSWORD` at module initialization.
- `backend/services/email.service.ts` reads `EMAIL_FROM` when building the message.
- `backend/src/index.ts` calls `dotenv.config()` only after its imports.
- `backend/logs/error.log` repeatedly records `Account created but verification email could not be sent.` on August 19, August 20, and August 30, 2026.
- The configuration check found `SMTP_HOST`, SMTP credentials, and `EMAIL_FORM` populated, but `EMAIL_FROM` missing.

## Recommended Fix

1. Load dotenv before importing application modules. A small bootstrap entry point is the cleanest option, for example a file that imports `dotenv/config` first and then dynamically imports `src/index.ts`. Alternatively, move environment loading to a module imported before the transporter and ensure the application imports that module first.
2. Rename `EMAIL_FORM` to `EMAIL_FROM` in the local environment configuration.
3. Add `EMAIL_FROM` to a documented environment template such as `.env.example`, without including credentials.
4. Add startup validation for the required SMTP variables and call `emailTransporter.verify()` during startup so configuration or connection failures are visible immediately.
5. Keep verification-email delivery failure handling consistent with the desired account lifecycle. The current registration flow creates the user before sending mail, so a failed send leaves an unverified account that must use resend or be cleaned up.

## Recommended Fix Audit

Checked on September 3, 2026:

| Recommendation | Status | Check result |
| --- | --- | --- |
| Load dotenv before application modules | **Not fixed** | `dotenv.config()` appears in `src/index.ts`, but it is still a static-import module and its dependent modules can initialize before the call. Environment loading must happen in a bootstrap module or directly before transporter creation. |
| Rename `EMAIL_FORM` to `EMAIL_FROM` | **Not fixed** | `backend/.env` still defines `EMAIL_FORM`, while `email.service.ts` reads `EMAIL_FROM`. |
| Add a documented environment template | **Not fixed** | No `.env.example` file exists. |
| Validate SMTP settings and call `emailTransporter.verify()` at startup | **Not fixed** | `email.config.ts` creates the transporter without required-variable checks, and `src/index.ts` does not call `verify()`. |
| Make account lifecycle behavior consistent after send failure | **Partially addressed** | Registration creates the account before sending and returns an error on failure. A resend endpoint exists, but the account is left unverified and there is no cleanup or retry policy. |
| Protect and rotate SMTP credentials | **Not fixed** | `.env` remains outside `.gitignore` and contains an SMTP password. The credential should be rotated and removed from any repository history where it was committed. |
| Resolve the separate PostgreSQL issue before testing | **Unresolved** | Existing logs show failed connections to `localhost:5432`; database availability was not changed by this audit. |

No runtime fixes were applied during this audit; the table records the current implementation status and the remaining work.

## Security Warning

The backend `.env` file contains a live-looking SMTP credential and is tracked by Git. Rotate that SMTP password/app password immediately, remove `.env` from version control while keeping it locally ignored by `.gitignore`, and confirm the secret is removed from repository history if it was pushed. Do not include the replacement credential in this report or in source control.

## Separate Issue

The logs also show Prisma failures connecting to `localhost:5432` on August 29, 2026. That database outage is independent of the SMTP failure, but it can prevent registration from reaching the email-sending step at all. Ensure PostgreSQL is running and the `DATABASE_URL` is valid when testing the email fix.