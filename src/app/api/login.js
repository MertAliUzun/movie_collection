// pages/api/login.js
import connectMongo from "../../libs/dbConnect";
import Client from "../../models/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { clientName, password } = req.body;

  try {
    await connectMongo();
    const client = await Client.findOne({ clientName, password });
    if (!client) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ clientName: client.clientName });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
