import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.log(error));

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000!");
});
