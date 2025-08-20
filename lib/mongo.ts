'use server';

import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI || "");
const db = client.db("BP-Tracking-Data");

export default async function getDB() {
  return db;
}
