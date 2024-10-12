// Importing necessary functions from express-validator for validation
import { body, validationResult } from "express-validator";

// Middleware to validate job creation form inputs
export const jobCreateValidation = async (req, res, next) => {
  // Define validation rules for job creation
  const rules = [
    body("job_category").notEmpty().withMessage("Job category required"), // Check if job_category is not empty
    body("job_designation")
      .notEmpty()
      .withMessage("Job description is required"), // Check if job_designation is not empty
    body("skills_required").notEmpty().withMessage("Skills are required"), // Check if skills_required is not empty
    body("apply_by").notEmpty().withMessage("Apply by date is required"), // Check if apply_by is not empty
  ];

  // Execute all validation rules concurrently
  await Promise.all(rules.map((rule) => rule.run(req)));

  // Collect validation results
  var validationErrors = validationResult(req);

  // If there are validation errors, render the form with error messages
  if (!validationErrors?.isEmpty()) {
    return res.render("new-job", {
      errorMessage: validationErrors?.array(), // Send validation errors to the view
    });
  }

  // If validation is successful, proceed to the next middleware or route handler
  next();
};
