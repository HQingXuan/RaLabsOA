const express = require("express");
const mongoose = require("mongoose");
const blogRouter = require("./routes/BlogRoutes");
const userRouter = require("./routes/UserRoutes");
const app = express();


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/CRUD", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

module.exports = app;









