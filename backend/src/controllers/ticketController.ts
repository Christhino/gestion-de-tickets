/**
 * Controllers
 */
import { Request, Response, NextFunction } from "express";
import { ticketService } from "../services/ticketService";

export const ticketController = {
  list(_req: Request, res: Response) {
    const tickets = ticketService.listTickets();
    res.status(200).json(tickets);
  },

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = ticketService.createTicket(req.body?.title);
      res.status(201).json(ticket);
    } catch (err) {
      next(err);
    }
  },

  
  updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body ?? {};

      if (typeof id !== "string") {
        return res.status(400).json({ error: "invalid ticket id" });
      }
      if (typeof status !== "string") {
        return res.status(400).json({ error: "status is required" });
      }

      const ticket = ticketService.updateStatus(id, status);
      return res.status(200).json(ticket);
    } catch (err) {
      return next(err);
    }
  },
};
