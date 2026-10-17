
import { Queue } from "bullmq";
import redisConnection from "../config/redis.ts";

export interface VerificationEmailJob {
  outboxEventId: string;
  userId: string;
}

export const emailQueue = new Queue<VerificationEmailJob>(
  "auth-emails",
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: {
        count: 500,
      },
      removeOnFail: {
        count: 1000,
      },
    },
  },
);

export const enqueueVerificationEmail = async (
  data: VerificationEmailJob,
) => {
  if (!data.outboxEventId || !data.userId) {
    throw new Error(
      "Cannot enqueue verification email: outboxEventId and userId are required.",
    );
  }

  return emailQueue.add("send-verification-email", data, {
    jobId: `outbox-${data.outboxEventId}`,
  });
};
