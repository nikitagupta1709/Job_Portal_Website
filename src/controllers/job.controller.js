// job.controller.js
import JobModel from "../models/job.model.js";

export default class JobController {
  constructor() {
    this.postJob = this.postJob.bind(this); // Bind the method to the class instance
  }

  // Fetch all jobs
  getJobs() {
    return JobModel.getAll(); // Fetch from the model
  }

  formatDate() {
    const now = new Date();

    // Extract date components
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = now.getFullYear();

    // Extract time components
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // Determine AM/PM and format the hours
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedHours = String(hours).padStart(2, "0");

    // Format the final string
    return `${day}/${month}/${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }

  // Handle job creation
  postJob(req, res) {
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

    const skillsArray = skills_required.split(",").map((skill) => skill.trim());
    const userEmail = req.session.userEmail;
    const userName = req.session.userName;
    const posted_on = this.formatDate();
    const applicants = [];
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

    res.redirect("/jobs"); // Redirect to jobs listing after creation
  }

  // Fetch job details by ID
  getJobDetails(req, res) {
    const id = req.params.id;
    const jobFound = JobModel.getJobById(id);
    if (jobFound) {
      res.render("job-details", {
        job: jobFound,
        errorMessage: null,
        userEmail: req.session.userEmail,
        userName: req.session.userName,
      });
    }
    // 2. else return errors.
    else {
      res.render("error", { errorMessage: "No job found" });
    }
  }

  getUpdateJobData(req, res) {
    const id = req.params.id;
    const jobData = JobModel.getJobById(id);
    return jobData;
  }

  updateJobData(req, res) {
    const id = req.params.id;
    const jobFound = JobModel.getJobById(id);
    console.log("jobFound", jobFound);
    if (!jobFound) {
      return res.render("error", { errorMessage: "No job found" });
    }
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
        [].concat(req.body.skills_required || [])
      ),
      apply_by: req.body.apply_by || jobFound.apply_by,
      userEmail: req.body.userEmail || jobFound.userEmail,
      userName: req.body.userName || jobFound.userName,
      posted_on: req.body.posted_on || jobFound.posted_on,
      applicants: req.body.applicants || jobFound.applicants,
    };
    JobModel.update(jobObj);
    res.redirect(`/job/${id}`);
  }

  deleteJob(req, res) {
    const id = req.params.id;
    const jobData = JobModel.getJobById(id);
    if (!jobData) {
      return res.render("error", { errorMessage: "No job found" });
    }
    if (req.session.userEmail !== jobData?.userEmail) {
      return res.render("error", {
        errorMessage: "You are not authorized to delete this job!",
      });
    }
    JobModel.delete(id);
    res.redirect("/jobs");
  }

  getApplicantData(req, res) {
    const id = req.params.id;
    const jobFound = JobModel.getJobById(id);
    if (!jobFound) {
      return res.render("error", { errorMessage: "No job found" });
    }
    if (jobFound?.applicants?.length === 0) {
      return res.render("error", { errorMessage: "0 applicants found" });
    }
    console.log("jobFound", jobFound);
    res.render("applicant-listing", {
      data: jobFound?.applicants,
    });
  }

  addApplicantData(req, res) {
    const id = req.params.id;
    const jobFound = JobModel.getJobById(id);
    if (!jobFound) {
      return res.render("error", { errorMessage: "No job found" });
    }
    if (jobFound?.userEmail === req.session.userEmail) {
      return res.render("error", {
        errorMessage: "You are not authoried recruiter",
      });
    }
    const currentDate = new Date();
    const applyByDate = new Date(jobFound?.apply_by);
    if (currentDate > applyByDate) {
      return res.render("error", {
        errorMessage: "The application deadline has passed.",
      });
    }
    req.body.resume = `/resumes/${req.file.filename}`;
    JobModel.addApplicant(req.body, id);
    res.redirect("/jobs");
  }
}
