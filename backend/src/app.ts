
import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: "deployguard-api",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

export default app;
