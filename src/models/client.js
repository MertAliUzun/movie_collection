import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  clientName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Client = mongoose.models.Client || mongoose.model("Client", ClientSchema);

export default Client;