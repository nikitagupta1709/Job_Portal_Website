import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import UserController from "./src/controllers/user.controller.js";
import {
  actionMiddleWare,
  auth,
  dateExpiredMidlleware,
} from "./src/middlewares/auth.middleware.js";
import JobsController from "./src/controllers/job.controller.js";
import { jobCreateValidation } from "./src/middlewares/validation.middleware.js";
import { uploadFile } from "./src/middlewares/file-upload.middleware.js";
import { settingLastVisit } from "./src/middlewares/last-visit.middleware.js";

const app = express();
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  session({
    secret: "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const usersController = new UserController();
const jobController = new JobsController();

app.use(expressEjsLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "views"));

// HOME PAGE
app.get("/", settingLastVisit, (req, res) => {
  res.render("landing", { errorMessage: null });
});

// REGISTER
app.post("/register", usersController.postRegister);

// ERROR
app.get("/error", (req, res) => {
  res.status(404).render("error", { errorMessage: null });
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  res.render("login", {
    userEmail: req.session?.userEmail || null,
    userName: req.session?.userName || null,
    errorMessage: null,
  });
});

// POST LOGIN
app.post("/login", usersController.postLogin);

// LOGOUT
app.get("/logout", usersController.logout);

// GET JOB LIST
app.post("/jobs", (req, res) => {
  const jobs = jobController.getJobs();
  res.render("job-listing", {
    jobs,
    userEmail: req.session?.userEmail || null,
    userName: req.session?.userName || null,
  });
});

app.get("/jobs", (req, res) => {
  const query = req.query.query?.toLowerCase() || ""; // Get the search query from the request
  const allJobs = jobController.getJobs(); // Get all jobs

  // If the query is empty, display all jobs
  if (query === "") {
    return res.render("job-listing", {
      jobs: allJobs,
      query: query, // Pass the empty query back to the template
      userEmail: req.session?.userEmail || null,
      userName: req.session?.userName || null,
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
    return res.status(404).render("error", { errorMessage: "No jobs found" });
  }

  // Render the job listing page with the filtered jobs
  res.render("job-listing", {
    jobs: filteredJobs,
    query: query, // Pass the query back to the template for retaining the input
    userEmail: req.session?.userEmail || null,
    userName: req.session?.userName || null,
  });
});

// GET JOB POST (Render form for posting a new job)
app.get("/postjob", auth, (req, res) => {
  res.render("new-job", {
    userEmail: req.session?.userEmail || null,
    userName: req.session?.userName || null,
    errorMessage: null,
  });
});

// CREATE NEW JOB (Handle job creation)
app.post("/postjob", jobCreateValidation, jobController.postJob);

// JOB DETAILS (View specific job details)
app.get("/job/:id", jobController.getJobDetails);

//GET UPDATE DATA
app.get("/job/update/:id", auth, actionMiddleWare, (req, res) => {
  const jobData = jobController.getUpdateJobData(req, res);
  res.render("update-job", {
    job: jobData,
    userEmail: req.session?.userEmail || null,
    userName: req.session?.userName || null,
  });
});

// POST UPDATE JOB
app.post("/job/update/:id", auth, jobController.updateJobData);

// DELTE JOB
app.post("/job/delete/:id", auth, actionMiddleWare, jobController.deleteJob);

// APPLICANT LIST
app.get("/job/applicants/:id", auth, jobController.getApplicantData);

app.get(
  "/check-application-deadline/:id",
  jobController.checkApplicationDeadline
);
// POST APPLICANT
app.post(
  "/apply/:id",
  dateExpiredMidlleware,
  uploadFile.single("resume"),
  jobController.addApplicantData
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
