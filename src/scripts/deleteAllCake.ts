import "dotenv/config";
import cakeTable from "../models/cake.model";
import db from "../database";
const deleteCakesData = async () => {
  try {
    await db.delete(cakeTable);
    console.log("✅ Delete successful");
  } catch (error) {
    console.error("❌ Delete failed");
    console.error(error);
  } finally {
    process.exit(0); // Prevents the script from hanging in your console
  }
};

deleteCakesData();
