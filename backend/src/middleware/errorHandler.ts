import { Request, Response, NextFunction } from "express";
import { NotFoundError, ValidationError } from "../services/ticketService";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }

  console.error("Unexpected error:", err);
  res.status(500).json({ error: "Internal server error." });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Route not found." });
}
