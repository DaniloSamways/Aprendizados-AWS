import { Router } from "express";
import s3Router from "./s3.router";

const router = Router();

router.use("/s3", s3Router);

export { router };
