import { connect } from "mongoose"

//פונקציה של התחברות למסד הנתונים MongoDB
export async function connectDB(): Promise<void> {
    try {
        console.log("📡 Starting DB connection...");

        // const dbUrl =  process.env.DB_URL as string
        const dbUrl = process.env.DB_URL_SHOSHI as string
        //  || "mongodb://localhost:27017/sleepyCare";
        const connection = await connect(dbUrl);

        const dbName = connection.connection.name;
        const host = connection.connection.host;
        const port = connection.connection.port;

        console.log(`✅ Connected to MongoDB | Host: ${host} | Port: ${port} | Database: ${dbName}`);
    } catch (err) {
        console.error("❌ Failed to connect to DB:", err instanceof Error ? err.message : err);
        process.exit(1);
    }
}
