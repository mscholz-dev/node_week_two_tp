//config
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);
import connectDB from "./config/db.js";
connectDB();
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import flash from "connect-flash";

// express router
import frontRouter from "./routes/frontRouter.js";
import apiRouter from "./routes/apiRouter.js";

const PORT = process.env.PORT;

// bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("dev"));

app.use(express.static("public"));

// view engine
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// add headers
app.use((__, res, next) => {
  res.set("Cache-Control", "no-store");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,UPDATE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
});

// disable trash header
app.disable("x-powered-by");

// setting security response headers
app.use((__, res, next) => {
  // prevent xss failure
  res.header("X-XSS-Protection", "1; mode=block");
  // prevent iframe
  res.header("X-Frame-Options", "deny");
  // prevent mime sniffing
  res.header("X-Content-Type-Options", "nosniff");
  next();
});

// session config for express and socket io
const sessionConfig = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
});

app.use(sessionConfig);

app.use(flash());

// api routes
app.use("/", frontRouter);
app.use("/api", apiRouter);

// app ready
server.listen(PORT, () => {
  console.log(`
  --------------------------------
  Listening on port: ${PORT}
  --------------------------------
         ___       _____     __
        /   \\     |   _  \\  |  |
       /  ^  \\    |  |_)  | |  |
      /  /_\\  \\   |   ___/  |  |
     /  _____  \\  |  |      |  |
    /__/     \\__\\ |__|      |__|

  --------------------------------
  `);
});

// export Express API
export default app;
