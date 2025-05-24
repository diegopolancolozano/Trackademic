import { MongoClient } from "mongodb";
const uri = import.meta.env.VITE_MONGO_URI;

const mongo=new MongoClient(uri).collection("trackademic");

export default mongo