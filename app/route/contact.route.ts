import express from "express";
import { contacts } from "../controller/contact.controller";

export const contactsRouter = express.Router();

contactsRouter
  .route("/")
  .get(contacts.findAll)
  .post(contacts.create)
  .delete(contacts.deleteAll);

contactsRouter.route("/favorite").get(contacts.findAllFavorite);

contactsRouter
  .route("/:id")
  .get(contacts.findOne)
  .put(contacts.update)
  .delete(contacts.delete);
