import PocketBase from "pocketbase";
import dotenv from "dotenv";

export const pb = new PocketBase(dotenv.config().parsed.POCKETBASE_URL);
const authData = await pb.admins.authWithPassword(
    dotenv.config().parsed.POCKETBASE_EMAIL,
    dotenv.config().parsed.POCKETBASE_PASWORD
);
