import { body, validationResult } from "express-validator";

export const jobCreateValidation = async (req, res, next) => {
  const rules = [
    body("job_category").notEmpty().withMessage("Job cateory required"),
    body("job_designation")
      .notEmpty()
      .withMessage("Job description is required"),
    body("skills_required").notEmpty().withMessage("Skills are required"),
    body("apply_by").notEmpty().withMessage("Apply by date is required"),
  ];

  await Promise.all(rules.map((rule) => rule.run(req)));

  var validationErrors = validationResult(req);
  if (!validationErrors?.isEmpty()) {
    return res.render("new-job", {
      errorMessage: validationErrors?.array(),
    });
  }
  next();
};
