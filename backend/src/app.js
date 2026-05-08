// import express from "express";
// import cors from "cors";
// import testRoutes from "./Routes/testRoutes.js";

// const app = express();

// app.use(cors());
// app.use(express.json());

// /* 🔥 GLOBAL REQUEST + RESPONSE TIMEOUT */
// app.use((req, res, next) => {
//   // request timeout (incoming request)
//   req.setTimeout(300000, () => {
//     console.log("Request timeout triggered");
//     res.status(408).send("Request Timeout");
//   });

//   // response timeout (server processing too slow)
//   res.setTimeout(300000, () => {
//     console.log("Response timeout triggered");
//     res.status(503).send("Server Timeout");
//   });

//   next();
// });

// /* ROUTES */
// app.use("/api", testRoutes);

// app.get("/", (req, res) => {
//   res.send("AI Test Case Generator running");
// });

// export default app;
import express from "express";
import cors from "cors";
import testRoutes from "./Routes/testRoutes.js";


const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* OPTIONAL: EXPRESS SAFETY TIMEOUT (not main fix but safe) */
app.use((req, res, next) => {
  req.setTimeout(300000);
  res.setTimeout(300000);
  next();
});

/* ROUTES */
app.use("/api", testRoutes);

app.get("/", (req, res) => {
  res.send("AI Test Case Generator running");
});

export default app;