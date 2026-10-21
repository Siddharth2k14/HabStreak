import { emailQueue } from "../queues/email.queue.ts";

try {
  await emailQueue.obliterate({ force: true });
  console.log("Email queue cleared successfully.");
} catch (error) {
  console.error("Failed to clear email queue:", error);
  process.exitCode = 1;
} finally {
  await emailQueue.close();
}