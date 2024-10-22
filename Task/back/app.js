const express = require("express");
const app = express();

require("dotenv").config();
require("./conn/conn");

const cors = require("cors");
app.use(cors());
app.use(express.json());

const UserApi = require("./routes/user");
const TaskApi = require("./routes/task");

app.use("/api/v1", UserApi);
app.use("/api/v2", TaskApi);

app.use("/",(req,res)=>{
    res.send("Hello from backend Side");
});

const PORT = 1000;
app.listen(PORT, ()=> console.log("Server Started"));