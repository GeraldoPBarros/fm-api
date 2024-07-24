"use strict";

import express from "express";
import cors from "cors";
import { fetchData } from "./aws-config.js";

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend domain
  methods: "GET, POST, PUT, DELETE",
  optionsSuccessStatus: 200, // Optional: Code to send for preflight requests
};

app.post("/question", cors(corsOptions), (req, res) => {
  fetchData(req.body["data"])
    .then((response) => {
      res.status(200).json({ message: response });
    })
    .catch(() => {
      res.send("ERROR!");
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
