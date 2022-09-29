import { NextFunction, Request, Response } from "express";
import { ApiError } from "../api-error";
import { ContactService } from "../services/contact.service";
import { MongoDB } from "../utils/mongodb.util";

export const contacts = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body?.name) {
      return next(new ApiError(400, "Name cannot be empty"));
    }
    try {
      const contactService = new ContactService(MongoDB.client);
      const document = await contactService.create(req.body);
      res.send(document);
    } catch (error) {
      return next(
        new ApiError(500, "An error occured while creating the context")
      );
    }
  },

  findAll: async (req: Request, res: Response, next: NextFunction) => {
    let documents = [];
    try {
      const contactService = new ContactService(MongoDB.client);
      const { name } = req.query;
      if (name) {
        documents = await contactService.findByName(name as string);
      } else {
        documents = await contactService.find({});
      }
    } catch (error) {
      return next(
        new ApiError(500, "An error occured while retrieving contacts")
      );
    }

    return res.send(documents);
  },
  findOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contactService = new ContactService(MongoDB.client);
      const document = await contactService.findById(req.params.id);
      if (!document) {
        return next(new ApiError(404, "Contact not found"));
      }

      return res.send(document);
    } catch (error) {
      return next(
        new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
      );
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    if (Object.keys(req.body).length === 0) {
      return next(new ApiError(500, "Data to update cannot be empty"));
    }

    try {
      const contactService = new ContactService(MongoDB.client);
      const document = await contactService.update(req.params.id, req.body);
      if (!document) {
        return next(new ApiError(404, "Contact not found"));
      }

      return res.send({ message: "Contact was updated successfully" });
    } catch (error) {
      new ApiError(500, `Error updating contact with id ${req.params.id}`);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contactService = new ContactService(MongoDB.client);
      const document = await contactService.delete(req.params.id);
      if (!document) {
        return next(new ApiError(404, "Contact not found"));
      }

      return res.send({ message: "Contact was deleted successfully" });
    } catch (error) {
      return next(
        new ApiError(500, `Could not delete contact with id=${req.params.id}`)
      );
    }
  },
  findAllFavorite: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contactService = new ContactService(MongoDB.client);
      const document = await contactService.findFavorite();
      return res.send(document);
    } catch (error) {
      return next(
        new ApiError(500, "An error occured while retrieving favorite contact")
      );
    }
  },
  deleteAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contactService = new ContactService(MongoDB.client);
      const deletedCount = await contactService.deleteAll();

      return res.send({
        message: `${deletedCount} contacts were deleted successfully`,
      });
    } catch (error) {
      return next(
        new ApiError(500, "An erro occured while removing all contacts")
      );
    }
  },
};
