import express from "express";
import cors from "cors";
import { ticketRoutes } from "./routes/ticketRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  app.use("/api", ticketRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);


  return app;
}
