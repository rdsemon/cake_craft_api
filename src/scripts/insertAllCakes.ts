import "dotenv/config";
import db from "../database";
import cakeTable from "../models/cake.model";
import { cakesData } from "../data/cake.data";

const insertCakesData = async () => {
  try {
    await db.insert(cakeTable).values(cakesData);
    console.log("✅ Upload successful");
  } catch (error) {
    console.error("❌ Upload failed");
    console.error(error);
  } finally {
    process.exit(0);
  }
};

insertCakesData();
