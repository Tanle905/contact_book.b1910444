import { Collection, MongoClient, ObjectId } from "mongodb";
import { Contact } from "../interface/product.interface";

export class ContactService {
  contact: Collection;

  constructor(client: MongoClient) {
    this.contact = client.db().collection("contacts");
  }

  extractContactData(payload: Contact) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite,
    };
    Object.keys(contact).forEach(
      (key) => contact[key] === undefined && delete contact[key]
    );

    return contact;
  }

  async create(payload: Contact) {
    const contact = this.extractContactData(payload);
    const result = await this.contact.findOneAndUpdate(
      contact,
      {
        $set: { favorite: contact.favorite === true },
      },
      { returnDocument: "after", upsert: true }
    );

    return result.value;
  }

  async find(filter) {
    const cursor = await this.contact.find(filter);
    return await cursor.toArray();
  }

  async findByName(name: string) {
    await this.contact.createIndex({ name: "text" });
    return await this.contact
      .find({
        $text: {
          $search: name,
          $caseSensitive: false,
        },
      })
      .toArray();
  }

  async findById(id: string) {
    return await this.contact.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id: string, payload: Contact) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractContactData(payload);
    const result = await this.contact.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return result.value;
  }

  async delete(id: string) {
    const result = await this.contact.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });

    return result.value;
  }

  async findFavorite() {
    return await this.contact.find({ favorite: true }).toArray();
  }

  async deleteAll() {
    const result = await this.contact.deleteMany({});

    return result.deletedCount;
  }
}
