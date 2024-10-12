// job.controller.js
import JobModel from "../models/job.model.js"; // Import the JobModel for job-related operations
import { sendMail } from "../utils/mailer.js"; // Import the mailer utility for sending emails

export default class JobController {
  constructor() {
    this.postJob = this.postJob.bind(this); // Bind the method to the class instance to preserve context
  }

  // Fetch all jobs
  getJobs() {
    return JobModel.getAll(); // Call the model method to retrieve all jobs
  }

  // Format the current date and time into a specific string format
  formatDate() {
    const now = new Date(); // Get the current date and time

    // Extract date components
    const day = String(now.getDate()).padStart(2, "0"); // Get the day, ensuring it is two digits
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Get the month (0-indexed), ensuring it is two digits
    const year = now.getFullYear(); // Get the year

    // Extract time components
    let hours = now.getHours(); // Get hours in 24-hour format
    const minutes = String(now.getMinutes()).padStart(2, "0"); // Get minutes, ensuring it is two digits
    const seconds = String(now.getSeconds()).padStart(2, "0"); // Get seconds, ensuring it is two digits

    // Determine AM/PM and convert hours to 12-hour format
    const ampm = hours >= 12 ? "pm" : "am"; // Determine if it is AM or PM
    hours = hours % 12 || 12; // Convert hours to 12-hour format, using 12 for midnight
    const formattedHours = String(hours).padStart(2, "0"); // Ensure hours are two digits

    // Format the final date and time string
    return `${day}/${month}/${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }

  // Handle job creation
  postJob(req, res) {
    // Destructure job details from the request body
    const {
      job_category,
      job_designation,
      job_location,
      company_name,
      salary,
      number_of_openings,
      skills_required,
      apply_by,
    } = req.body;

    // Split and trim skills into an array
    const skillsArray = skills_required.split(",").map((skill) => skill.trim());
    const userEmail = req.session.userEmail; // Get the user's email from session
    const userName = req.session.userName; // Get the user's name from session
    const posted_on = this.formatDate(); // Format the current date
    const applicants = []; // Initialize an empty array for applicants

    // Add the new job using the JobModel
    JobModel.add(
      job_category,
      job_designation,
      job_location,
      company_name,
      salary,
      number_of_openings,
      skillsArray,
      apply_by,
      userEmail,
      userName,
      posted_on,
      applicants
    );

    res.redirect("/jobs"); // Redirect to the jobs listing after job creation
  }

  // Fetch job details by ID
  getJobDetails(req, res) {
    const id = req.params.id; // Get the job ID from the request parameters
    const jobFound = JobModel.getJobById(id); // Find the job by ID
    if (jobFound) {
      // If the job is found, render the job details page
      res.render("job-details", {
        job: jobFound,
        errorMessage: null, // No error message initially
        userEmail: req.session.userEmail, // Pass the user's email to the view
        userName: req.session.userName, // Pass the user's name to the view
      });
    } else {
      // If no job is found, return a 404 error
      res.status(404).render("error", { errorMessage: "No job found" });
    }
  }

  // Retrieve data for updating job details by ID
  getUpdateJobData(req, res) {
    const id = req.params.id; // Get the job ID from the request parameters
    const jobData = JobModel.getJobById(id); // Find the job by ID
    return jobData; // Return the job data
  }

  // Update job data based on the provided information
  updateJobData(req, res) {
    const id = req.params.id; // Get the job ID from the request parameters
    const jobFound = JobModel.getJobById(id); // Find the job by ID
    if (!jobFound) {
      // If no job is found, return a 404 error
      return res.status(404).render("error", { errorMessage: "No job found" });
    }

    // Construct the job object for updating, using existing values as defaults
    const jobObj = {
      id: id,
      job_category: req.body.job_category || jobFound.job_category,
      job_designation: req.body.job_designation || jobFound.job_designation,
      job_location: req.body.job_location || jobFound.job_location,
      company_name: req.body.company_name || jobFound.company_name,
      salary: req.body.salary || jobFound.salary,
      number_of_openings:
        req.body.number_of_openings || jobFound.number_of_openings,
      skills_required: jobFound.skills_required.concat(
        [].concat(req.body.skills_required || []) // Concatenate new skills with existing ones
      ),
      apply_by: req.body.apply_by || jobFound.apply_by,
      userEmail: req.body.userEmail || jobFound.userEmail,
      userName: req.body.userName || jobFound.userName,
      posted_on: req.body.posted_on || jobFound.posted_on,
      applicants: req.body.applicants || jobFound.applicants,
    };

    JobModel.update(jobObj); // Update the job in the model
    res.redirect(`/job/${id}`); // Redirect to the updated job details page
  }

  // Delete a job by ID
  deleteJob(req, res) {
    const id = req.params.id; // Get the job ID from the request parameters
    const jobData = JobModel.getJobById(id); // Find the job by ID
    if (!jobData) {
      // If no job is found, return a 404 error
      return res.status(404).render("error", { errorMessage: "No job found" });
    }
    if (req.session.userEmail !== jobData?.userEmail) {
      // Check if the current user is authorized to delete the job
      return res.status(404).render("error", {
        errorMessage: "You are not authorized to delete this job!",
      });
    }
    JobModel.delete(id); // Delete the job from the model
    res.redirect("/jobs"); // Redirect to the jobs listing after deletion
  }

  // Fetch the applicants for a specific job
  getApplicantData(req, res) {
    const id = req.params.id; // Get the job ID from the request parameters
    const jobFound = JobModel.getJobById(id); // Find the job by ID
    if (!jobFound) {
      // If no job is found, return a 404 error
      return res.status(404).render("error", { errorMessage: "No job found" });
    }
    if (jobFound?.applicants?.length === 0) {
      // If no applicants are found, return a 404 error
      return res
        .status(404)
        .render("error", { errorMessage: "0 applicants found" });
    }
    res.render("applicant-listing", {
      data: jobFound?.applicants, // Pass the applicants data to the view
    });
  }

  // Add an applicant to a specific job
  addApplicantData(req, res) {
    const id = req.params.id; // Get the job ID from the request parameters
    const jobFound = JobModel.getJobById(id); // Find the job by ID
    if (!jobFound) {
      // If no job is found, return a 404 error
      return res.status(404).render("error", { errorMessage: "No job found" });
    }
    if (jobFound?.userEmail === req.session.userEmail) {
      // Check if the current user is the recruiter for the job
      return res.status(404).render("error", {
        errorMessage: "You are not authorized as a recruiter",
      });
    }

    req.body.resume = `/resumes/${req.file.filename}`; // Set the resume path from the uploaded file
    JobModel.addApplicant(req.body, id); // Add the applicant to the job
    sendMail(req.body.email, jobFound.job_designation, jobFound.company_name) // Send confirmation email
      .then(() => res.redirect("/jobs")) // Redirect to jobs listing after successful application
      .catch((err) =>
        res.status(404).render("error", {
          errorMessage: "Failed to send confirmation email.", // Handle email sending errors
        })
      );
  }

  // Check if the application deadline has passed for a specific job
  checkApplicationDeadline = (req, res) => {
    const id = req.params.id; // Get the job ID from the request parameters
    const jobFound = JobModel.getJobById(id); // Fetch job data

    // Get the current date and the application deadline
    const currentDate = new Date();
    const applyByDate = new Date(jobFound.apply_by);

    if (currentDate > applyByDate) {
      // If the current date exceeds the application deadline, return a 404 error
      return res
        .status(404)
        .render("error", { errorMessage: "Application deadline has passed." });
    }

    res.redirect(`/job/${id}`); // If deadline has not passed, redirect to the job details
  };
}
