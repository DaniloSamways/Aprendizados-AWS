import { Router } from "express";
import multer from "multer";
import { S3Controller } from "../controller/s3.controller";
import { S3Client } from "@aws-sdk/client-s3";
import { awsConfig } from "../config/aws";

const s3Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const S3 = new S3Client({
  credentials: {
    accessKeyId: "123",
    secretAccessKey: "123",
  },
  endpoint: "https://localhost.localstack.cloud:4566",
  forcePathStyle: true,
  region: "us-east-1",
});

const s3Controller = new S3Controller(S3);

s3Router.post("/", upload.single("file"), s3Controller.uploadFile.bind(s3Controller));
s3Router.get("/", s3Controller.getFiles.bind(s3Controller));

export default s3Router;
