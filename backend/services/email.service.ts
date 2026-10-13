import { emailTransporter } from "../config/email.config.ts";

interface VerificationEmailOptions {
    email: string;
    name: string;
    token: string;
}

export const sendVerificationEmail = async ({
    email,
    name,
    token,
}: VerificationEmailOptions): Promise<void> => {
    const verificationUrl =
        `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

    await emailTransporter.sendMail({
        from: `"HabStreak" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: "Verify your HabStreak account",

        text: `
Hello ${name},

Welcome to HabStreak.

Please verify your email address by clicking the link below:

${verificationUrl}

This verification link will expire soon.

If you did not create a HabStreak account, you can safely ignore this email.

Regards,
HabStreak Team
        `,

        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Verify your HabStreak account</title>
</head>

<body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:40px;">

    <div style="
        max-width:600px;
        margin:auto;
        background:white;
        padding:32px;
        border-radius:12px;
    ">

        <h1>Welcome to HabStreak</h1>

        <p>
            Hello ${name},
        </p>

        <p>
            Thanks for creating your HabStreak account.
            Please verify your email address to activate your account.
        </p>

        <div style="margin:30px 0;">
            <a
                href="${verificationUrl}"
                style="
                    display:inline-block;
                    background:#2563eb;
                    color:white;
                    padding:12px 24px;
                    border-radius:8px;
                    text-decoration:none;
                "
            >
                Verify Email
            </a>
        </div>

        <p>
            Or copy and paste this URL into your browser:
        </p>

        <p>
            ${verificationUrl}
        </p>

        <p>
            If you didn't create this account, you can safely ignore this email.
        </p>

        <p>
            — HabStreak Team
        </p>

    </div>

</body>
</html>
        `,
    });
};