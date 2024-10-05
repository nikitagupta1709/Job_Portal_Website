import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import path from "path";
import UserController from "./src/controllers/user.controller.js";
import { registerValidation } from "./src/middlewares/validation.middleware.js";

const app = express();
app.use(express.static("public"));
app.use(expressEjsLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "views"));

app.get("/", (req, res) => {
  res.render("landing", { errorMessage: null });
});

app.get("/jobs", (req, res) => {
  res.render("job-listing");
});

const usersController = new UserController();
app.post("/", usersController.postRegister);
app.post("/login", usersController.postLogin);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
