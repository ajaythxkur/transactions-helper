import "dotenv/config";
import express from "express";
const app = express();
app.use(express.json());
import http from "node:http";

//Tron
app.use('/tron', async (req, res) => {
    //code goes here
});

const PORT = process.env.PORT ?? 8000;
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`listening http://localhost:${PORT}`)
})