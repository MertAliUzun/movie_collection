// pages/api/register.js
import connectMongo from "../../libs/dbConnect";
import Client from "../../models/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { clientName, password } = req.body;

  try {
    await connectMongo();
    const existingClient = await Client.findOne({ clientName });
    if (existingClient) {
      return res.status(400).json({ error: "Client already exists" });
    }

    const newClient = new Client({ clientName, password });
    await newClient.save();
    res.status(201).json({ message: "Client registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
