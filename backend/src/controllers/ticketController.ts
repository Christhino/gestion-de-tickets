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
      const ticket = ticketService.updateStatus(req.params.id, req.body?.status);
      res.status(200).json(ticket);
    } catch (err) {
      next(err);
    }
  },
};
