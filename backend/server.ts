const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const helmet = require("helmet");

const initDb = require("./config/db");
const errorHandler = require("./middleware/error");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Connect to database
initDb();

// Route Files
const auth = require("./routes/auth/authRoute");
const users = require("./routes/user/userRoute");
const userProfiles = require("./routes/user/userProfileRoute");
const classrooms = require("./routes/classroom/classroomRoute");
const classroomParticipations = require("./routes/classroom/classroomParticipationRoute");
const lessons = require("./routes/classroom/lessonRoute");
const resources = require("./routes/classroom/resourceRoute");

const cors = require("cors");
const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS with performance optimizations
const corsOptions = {
  optionsSuccessStatus: 200,
  credentials: true,
  origin: true,
  maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));

// Body parser with size limits
app.use(
  express.json({
    limit: process.env.BODY_LIMIT || "10mb",
    verify: (req: any, res: any, buf: any) => {
      // Store raw body for signature verification if needed
      req.rawBody = buf;
    },
  })
);

// Cookie parser
app.use(cookieParser());

// Dev logging middleware with performance considerations
if (process.env.NODE_ENV === "development") {
  app.use(
    morgan("combined", {
      skip: (req: any, res: any) => {
        // Skip logging for health checks and static files
        return req.path === "/health" || req.path.startsWith("/public/");
      },
    })
  );
}

// File Uploading with size limits and performance optimizations
app.use(
  fileupload({
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_UPLOAD || "10485760"), // 10MB default
    },
    abortOnLimit: true,
    responseOnLimit: "File size limit has been reached",
    debug: process.env.NODE_ENV === "development",
    safeFileNames: true,
    preserveExtension: true,
  })
);

// Set static folder with caching headers
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: process.env.NODE_ENV === "production" ? "1d" : 0,
    etag: true,
    lastModified: true,
    setHeaders: (res: any, filePath: string) => {
      if (filePath.endsWith(".css")) {
        res.setHeader("Cache-Control", "public, max-age=86400"); // 1 day
      } else if (filePath.endsWith(".js")) {
        res.setHeader("Cache-Control", "public, max-age=86400"); // 1 day
      } else if (filePath.match(/\.(jpg|jpeg|png|gif|ico|svg)$/)) {
        res.setHeader("Cache-Control", "public, max-age=604800"); // 1 week
      }
    },
  })
);

// Mount routers with performance considerations
app.use("/api/v1/users", users);
app.use("/api/v1/userprofiles", userProfiles);
app.use("/api/v1/auth", auth);
app.use("/api/v1/classrooms", classrooms);
app.use("/api/v1/classroomParticipations", classroomParticipations);
app.use("/api/v1/lessons", lessons);
app.use("/api/v1/resources", resources);

// Error handler with performance logging
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Start server
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`
🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
      `);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err: any) => {
      console.error("💥 Unhandled Promise Rejection:", err);

      server.close(() => {
        console.log("🔄 Server closed due to unhandled rejection");
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err: any) => {
      console.error("💥 Uncaught Exception:", err);

      server.close(() => {
        console.log("🔄 Server closed due to uncaught exception");
        process.exit(1);
      });
    });
  } catch (error: any) {
    console.error("💥 Failed to start server:", error);
    process.exit(1);
  }
})();

module.exports = app;
