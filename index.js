import express from "express"; // Importing the Express framework
import expressEjsLayouts from "express-ejs-layouts"; // Importing EJS layouts for templating
import path from "path"; // Importing path module for handling file paths
import cookieParser from "cookie-parser"; // Importing cookie parser middleware
import session from "express-session"; // Importing session management middleware
import UserController from "./src/controllers/user.controller.js"; // Importing user controller
import {
  actionMiddleWare,
  auth,
  dateExpiredMidlleware,
} from "./src/middlewares/auth.middleware.js"; // Importing authentication middlewares
import JobsController from "./src/controllers/job.controller.js"; // Importing job controller
import { jobCreateValidation } from "./src/middlewares/validation.middleware.js"; // Importing job creation validation middleware
import { uploadFile } from "./src/middlewares/file-upload.middleware.js"; // Importing file upload middleware
import { settingLastVisit } from "./src/middlewares/last-visit.middleware.js"; // Importing middleware to set last visit time

const app = express(); // Creating an instance of the Express application
app.use(express.static("public")); // Serving static files from the "public" directory
app.use(cookieParser()); // Using cookie parser middleware
app.use(
  session({
    secret: "SecretKey", // Secret key for session encryption
    resave: false, // Prevent resaving session if unmodified
    saveUninitialized: true, // Save uninitialized session
    cookie: { secure: false }, // Cookie settings; should be true in production with HTTPS
  })
);

const usersController = new UserController(); // Creating an instance of UserController
const jobController = new JobsController(); // Creating an instance of JobsController

app.use(expressEjsLayouts); // Using EJS layouts
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies
app.set("view engine", "ejs"); // Setting the view engine to EJS
app.set("views", path.join(path.resolve(), "src", "views")); // Setting the views directory

// HOME PAGE
app.get("/", settingLastVisit, (req, res) => {
  res.render("landing", { errorMessage: null }); // Render the landing page with no error message
});

// REGISTER
app.post("/register", usersController.postRegister); // Handle user registration

// ERROR
app.get("/error", (req, res) => {
  res.status(404).render("error", { errorMessage: null }); // Render error page for 404 errors
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  res.render("login", {
    userEmail: req.session?.userEmail || null, // Pass user email to the login page if available
    userName: req.session?.userName || null, // Pass user name to the login page if available
    errorMessage: null, // No error message on initial load
  });
});

// POST LOGIN
app.post("/login", usersController.postLogin); // Handle user login

// LOGOUT
app.get("/logout", usersController.logout); // Handle user logout

// GET JOB LIST
app.post("/jobs", (req, res) => {
  const jobs = jobController.getJobs(); // Retrieve the list of jobs
  res.render("job-listing", {
    jobs, // Render job listing page with the retrieved jobs
    userEmail: req.session?.userEmail || null, // Pass user email to the job listing page
    userName: req.session?.userName || null, // Pass user name to the job listing page
  });
});

// GET JOBS WITH SEARCH FUNCTIONALITY
app.get("/jobs", (req, res) => {
  const query = req.query.query?.toLowerCase() || ""; // Get the search query from the request
  const allJobs = jobController.getJobs(); // Get all jobs

  // If the query is empty, display all jobs
  if (query === "") {
    return res.render("job-listing", {
      jobs: allJobs, // Render with all jobs
      query: query, // Pass the empty query back to the template
      userEmail: req.session?.userEmail || null, // Pass user email to the job listing page
      userName: req.session?.userName || null, // Pass user name to the job listing page
    });
  }

  // Filter jobs based on the search query
  const filteredJobs = allJobs.filter((job) => {
    return (
      job.job_designation.toLowerCase().includes(query) || // Check job designation
      job.company_name.toLowerCase().includes(query) || // Check company name
      job.job_location.toLowerCase().includes(query) || // Check job location
      job.skills_required.some(
        (
          skill // Check skills required
        ) => skill.toLowerCase().includes(query)
      )
    );
  });

  // If no jobs match the query, render the error page
  if (filteredJobs.length === 0) {
    return res.status(404).render("error", { errorMessage: "No jobs found" }); // Render error page if no jobs found
  }

  // Render the job listing page with the filtered jobs
  res.render("job-listing", {
    jobs: filteredJobs, // Render with filtered jobs
    query: query, // Pass the query back to the template for retaining the input
    userEmail: req.session?.userEmail || null, // Pass user email to the job listing page
    userName: req.session?.userName || null, // Pass user name to the job listing page
  });
});

// GET JOB POST (Render form for posting a new job)
app.get("/postjob", auth, (req, res) => {
  res.render("new-job", {
    userEmail: req.session?.userEmail || null, // Pass user email to the new job form
    userName: req.session?.userName || null, // Pass user name to the new job form
    errorMessage: null, // No error message on initial load
  });
});

// CREATE NEW JOB (Handle job creation)
app.post("/postjob", jobCreateValidation, jobController.postJob); // Validate input and handle job creation

// JOB DETAILS (View specific job details)
app.get("/job/:id", jobController.getJobDetails); // Retrieve job details based on ID

// GET UPDATE DATA
app.get("/job/update/:id", auth, actionMiddleWare, (req, res) => {
  const jobData = jobController.getUpdateJobData(req, res); // Get job data for updating
  res.render("update-job", {
    job: jobData, // Render update job form with job data
    userEmail: req.session?.userEmail || null, // Pass user email to the update job form
    userName: req.session?.userName || null, // Pass user name to the update job form
  });
});

// POST UPDATE JOB
app.post("/job/update/:id", auth, jobController.updateJobData); // Handle job update

// DELETE JOB
app.post("/job/delete/:id", auth, actionMiddleWare, jobController.deleteJob); // Handle job deletion

// APPLICANT LIST
app.get("/job/applicants/:id", auth, jobController.getApplicantData); // Retrieve and display applicants for a job

app.get(
  "/check-application-deadline/:id",
  jobController.checkApplicationDeadline // Check if the application deadline has expired
);

// POST APPLICANT
app.post(
  "/apply/:id",
  dateExpiredMidlleware, // Middleware to check if the application deadline has expired
  uploadFile.single("resume"), // Middleware for file upload (resume)
  jobController.addApplicantData // Handle adding applicant data
);

// Start the Express server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000"); // Log server status to the console
});
