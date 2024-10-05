import { body, validationResult } from "express-validator";

export const registerValidation = async (req, res, next) => {
  console.log("req", req.body);
  const rules = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ];

  await Promise.all(rules.map((rule) => rule.run(req)));

  var validationErrors = validationResult(req);
  console.log("error", validationErrors);
  if (!validationErrors?.isEmpty()) {
    return res.render("landing", {
      errorMessage: validationErrors?.array(),
    });
  }
  next();
};
