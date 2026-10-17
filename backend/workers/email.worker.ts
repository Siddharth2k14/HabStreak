
import { Worker } from "bullmq";
import redisConnection from "../config/redis.ts";
import prisma from "../config/prisma.ts";
import type { VerificationEmailJob } from "../queues/email.queue.ts";
import { sendVerificationEmail } from "../services/email.service.ts";
import {
  generateVerificationToken,
  hashVerificationToken,
} from "../utils/token.utils.ts";

const emailWorker = new Worker<VerificationEmailJob>(
  "auth-emails",
  async (job) => {
    switch (job.name) {
      case "send-verification-email": {
        const { userId } = job.data;

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            username: true,
            isActive: true,
            isVerified: true,
          },
        });

        if (!user) {
          throw new Error(`User ${userId} was not found.`);
        }

        // A duplicate job should not send another verification email
        // after the account has already been verified.
        if (user.isVerified) {
          console.log(`User ${userId} is already verified. Skipping email.`);
          break;
        }

        if (!user.isActive) {
          console.log(`User ${userId} is inactive. Skipping email.`);
          break;
        }

        const token = generateVerificationToken();
        const hashedToken = hashVerificationToken(token);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Persist the token hash before sending the email.
        await prisma.user.update({
          where: { id: userId },
          data: {
            verificationToken: hashedToken,
            verificationExpires: expiresAt,
          },
        });

        await sendVerificationEmail({
          email: user.email,
          name: user.username,
          token,
        });

        console.log(`Verification email job ${job.id} completed.`);
        break;
      }

      default:
        throw new Error(`Unsupported email job: ${job.name}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

emailWorker.on("ready", () => {
  console.log("Email worker connected to Redis and ready.");
});

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed.`);
});

emailWorker.on("failed", (job, error) => {
  console.error("Email job failed", {
    jobId: job?.id,
    jobName: job?.name,
    attemptsMade: job?.attemptsMade,
    error: error.message,
  });
});

emailWorker.on("error", (error) => {
  console.error("Email worker error:", error);
});

const shutdown = async () => {
  await emailWorker.close();
  await redisConnection.quit();
};

process.once("SIGINT", () => {
  void shutdown();
});

process.once("SIGTERM", () => {
  void shutdown();
});

export default emailWorker;
