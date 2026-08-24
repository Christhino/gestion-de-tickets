import { Router } from "express";
import { ticketController } from "../controllers/ticketController";

export const ticketRoutes = Router();

ticketRoutes.get("/tickets", ticketController.list);
ticketRoutes.post("/tickets", ticketController.create);
ticketRoutes.patch("/tickets/:id/status", ticketController.updateStatus);
