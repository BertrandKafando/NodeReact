const express = require("express");
const app = express();

app.use(express.json())
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute)



app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running!");
  });