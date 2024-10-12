import JobModel from "../models/job.model.js"; // Import the JobModel to access job-related data

// Middleware to authenticate user access
export const auth = (req, res, next) => {
  // Check if the user is logged in by verifying the session
  if (req.session.userEmail) {
    next(); // If logged in, proceed to the next middleware or route handler
  } else {
    // If not logged in, render an error page with an appropriate message
    res.status(404).render("error", {
      errorMessage:
        "Only recruiters are allowed to access this page. Login as a recruiter to continue.",
    });
  }
};

// Middleware to check if the user is authorized to perform actions on a job posting
export const actionMiddleWare = (req, res, next) => {
  const id = req.params.id; // Extract job ID from request parameters
  const jobData = JobModel.getJobById(id); // Fetch job data by ID

  // Check if the logged-in user is the owner of the job posting
  if (req.session.userEmail !== jobData?.userEmail) {
    return res.status(404).render("error", {
      errorMessage:
        "Access denied: You are not permitted to modify or remove this job posting.",
    });
  }
  next(); // If authorized, proceed to the next middleware or route handler
};

// Middleware to check if the job application deadline has expired
export const dateExpiredMidlleware = (req, res, next) => {
  const id = req.params.id; // Extract job ID from request parameters
  const jobFound = JobModel.getJobById(id); // Fetch job data by ID
  const currentDate = new Date(); // Get the current date
  const applyByDate = new Date(jobFound?.apply_by); // Get the job's application deadline

  // Check if the current date is past the application deadline
  if (currentDate > applyByDate) {
    return res.status(404).render("error", {
      errorMessage: "The application deadline has passed.",
    });
  }
  next(); // If the deadline has not expired, proceed to the next middleware or route handler
};
