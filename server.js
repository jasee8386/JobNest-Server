const express= require("express")
const dotenv = require("dotenv");
var cors = require('cors')
const app = express()
const authRoutes = require("./src/routes/authRoutes")
const connectDB = require("./src/config/db")
const adminRoutes = require("./src/routes/adminRoutes");
const jobRoutes = require("./src/routes/jobRoutes")
const employerRoutes = require("./src/routes/employerRoutes");
const jobseekerRoutes = require("./src/routes/jobseekerRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const chatRoutes = require("./src/routes/chatRoutes");

dotenv.config() 
connectDB();
  const allowedOrigins = [
  "http://localhost:5173",
  "https://job-nest-client-d5jq.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
       
const PORT=process.env.PORT
//Middlewares

app.use(express.json())//accepts all requests

app.use("/api/user",authRoutes)
app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes); 
app.use("/api/employer", employerRoutes);
app.use("/api/jobseeker", jobseekerRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/chats", chatRoutes);

const { errorHandler } = require("./src/middleware/errorMiddleware");
// 404 route
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

//Start Server
app.listen(PORT,()=>{
    console.log(` 🚀 Server Running on Port : ${PORT}`);})