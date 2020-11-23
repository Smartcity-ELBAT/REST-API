"use strict";

require("dotenv").config();
const Router = require("./route");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.APP_PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(Router);

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});