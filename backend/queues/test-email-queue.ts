import { enqueueVerificationEmail, emailQueue } from "./email.queue.ts";

try {
  const job = await enqueueVerificationEmail({
    email: "test@example.com",
    name: "Siddharth",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",
  });

  console.log("Job added:", job.id);

  const counts = await emailQueue.getJobCounts(
    "waiting",
    "active",
    "completed",
    "failed",
  );

  console.log("Queue counts:", counts);
} catch (error) {
  console.error("Queue test failed:", error);
  process.exitCode = 1;
} finally {
  await emailQueue.close();
}