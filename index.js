const connectToMngo = require("./db");
const express = require("express")
const cors = require("cors");

connectToMngo();

const app = express()
const port = 5000;

app.use(express.json())
app.use(cors());

app.use("/api/auth", require('./routes/auth'))
app.use("/api/properties", require('./routes/property'))

app.listen(port, () => {
  console.log(`App is running on port ${port}`)
})