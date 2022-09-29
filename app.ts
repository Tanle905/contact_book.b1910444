import express from "express";
import { ApiError } from "./app/api-error";
import cors from "cors";
import { contactsRouter } from "./app/route/contact.route";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: any, res: any) => {
  res.json({ message: "Welcome to contact book application" });
});
app.use("/api/contacts", contactsRouter);

// handle 404 response
app.use((req: any, res: any, next: any) => {
  // Code ở đây sẽ chạy khi không có route được định nghĩa nào
  // khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
  return next(new ApiError(404, "Resource not found"));
});
// define error-handling middleware last, after other app.use() and routes calls
app.use((error: any, req: any, res: any, next: any) => {
  // Middleware xử lý lỗi tập trung.
  // Trong các đoạn code xử lý ở các route, gọi next(error)
  // sẽ chuyển về middleware xử lý lỗi này
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
  });
});
