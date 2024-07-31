import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { awsConfig } from "../config/aws";

export class S3Controller {
  private bucket = "images-test";
  constructor(private S3: S3Client) {}

  async uploadFile(req: Request, res: Response) {
    const file = req.file;

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const uuid = randomUUID();
    const fileName = uuid + "-" + file.originalname;

    const uploadedFile = await this.S3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        ContentType: file?.mimetype,
        Body: file?.buffer,
      })
    )
      .then(() => ({
        fileName,
        fileUrl: awsConfig.endpoint + "/" + this.bucket + "/" + fileName,
        fileSize: file.size,
        fileMimeType: file.mimetype,
      }))
      .catch(() => null);

    if (!uploadedFile) {
      return res.status(500).send("Error uploading file.");
    }

    res.status(200).json(uploadedFile);
  }

  async getFiles(req: Request, res: Response) {
    const files = await this.S3.send(new ListObjectsV2Command({ Bucket: this.bucket }));

    const response = files.Contents?.map((file) => ({
      fileName: file.Key,
      fileUrl: `http://localhost:3000/${this.bucket}/${file.Key}`,
      fileSize: file.Size,
    }));

    res.status(200).json(response);
  }
}
