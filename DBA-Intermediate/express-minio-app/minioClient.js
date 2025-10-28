import { Client } from "minio";
import dotenv from "dotenv";
dotenv.config();

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Ensure bucket exists
(async () => {
  const bucket = process.env.MINIO_BUCKET;
  const exists = await minioClient.bucketExists(bucket).catch(() => false);
  if (!exists) {
    await minioClient.makeBucket(bucket);
    console.log(`✅ Created bucket: ${bucket}`);
  } else {
    console.log(`🪣 Bucket exists: ${bucket}`);
  }
})();

export default minioClient;

