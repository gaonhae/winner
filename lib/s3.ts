import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  // Keep presigned PUT URLs browser-friendly (avoid optional checksum params).
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN!;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function generatePresignedUrl(
  contentType: string,
  fileSize: number,
  userId: string
) {
  if (!ALLOWED_TYPES.includes(contentType)) {
    throw new Error(
      "허용되지 않는 파일 형식입니다. (JPEG, PNG, GIF, WebP만 가능)"
    );
  }

  if (fileSize > MAX_SIZE) {
    throw new Error("파일 크기는 5MB 이하여야 합니다.");
  }

  const ext = contentType.split("/")[1] === "jpeg" ? "jpg" : contentType.split("/")[1];
  const randomId = crypto.randomUUID();
  const key = `uploads/${userId}/${randomId}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });

  const cdnUrl = `https://${CLOUDFRONT_DOMAIN}/${key}`;

  return { presignedUrl, key, cdnUrl };
}

export async function deleteS3Object(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error("S3 객체 삭제 실패:", key, error);
  }
}
