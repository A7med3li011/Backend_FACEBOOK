import mongoose from "mongoose";

export async function connection() {
  await mongoose
    .connect(process.env.DATABASEONLINE)
    .then((res) => console.log("connection done"))
    .catch((err) => console.log("connection err"));
}
