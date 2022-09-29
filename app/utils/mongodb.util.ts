import { MongoClient } from "mongodb";

export class MongoDB {
  static client: MongoClient;
  
  static connect = async (uri: string) => {
    if (this.client) return this.client;
    this.client = await MongoClient.connect(uri);
    return this.client;
  };
}
