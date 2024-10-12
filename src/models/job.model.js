// JobModel class represents a job posting and contains methods for managing job data.
export default class JobModel {
  constructor(
    id, // Unique identifier for the job
    job_category, // Category of the job (e.g., Tech, Finance)
    job_designation, // Title of the job position
    job_location, // Location where the job is based
    company_name, // Name of the company offering the job
    salary, // Salary range for the job
    number_of_openings, // Number of available positions for the job
    skills_required, // List of skills required for the job
    apply_by, // Deadline for job applications
    userEmail, // Email of the user who posted the job
    userName, // Name of the user who posted the job
    posted_on, // Timestamp of when the job was posted
    applicants // List of applicants for the job
  ) {
    // Initialize the JobModel instance with the provided parameters
    this.id = id;
    this.job_category = job_category;
    this.job_designation = job_designation;
    this.job_location = job_location;
    this.company_name = company_name;
    this.salary = salary;
    this.number_of_openings = number_of_openings;
    this.skills_required = skills_required;
    this.apply_by = apply_by;
    this.userEmail = userEmail;
    this.userName = userName;
    this.posted_on = posted_on;
    this.applicants = applicants;
  }

  // Static method to retrieve all job postings
  static getAll() {
    return jobs;
  }

  // Static method to add a new job posting
  static add(
    job_category, // Category of the job
    job_designation, // Title of the job position
    job_location, // Job location
    company_name, // Company name
    salary, // Salary range
    number_of_openings, // Number of openings
    skills_required, // Required skills
    apply_by, // Application deadline
    userEmail, // Email of the job poster
    userName, // Name of the job poster
    posted_on, // Posting timestamp
    applicants // List of applicants (initially empty)
  ) {
    // Create a new job instance and add it to the jobs array
    let newJob = new JobModel(
      jobs.length + 1, // Automatically assign a new ID
      job_category,
      job_designation,
      job_location,
      company_name,
      salary,
      number_of_openings,
      skills_required,
      apply_by,
      userEmail,
      userName,
      posted_on,
      applicants
    );
    jobs.push(newJob); // Add the new job to the jobs array
  }

  // Static method to retrieve a job posting by its ID
  static getJobById(id) {
    return jobs.find((job) => job.id == id); // Find the job with the matching ID
  }

  // Static method to update an existing job posting
  static update(obj) {
    const index = jobs.findIndex((p) => p.id == obj.id); // Find the index of the job to update
    jobs[index] = {
      ...jobs[index], // Keep the existing fields
      ...obj, // Overwrite only the fields that are in the obj (new data)
    };
  }

  // Static method to delete a job posting by its ID
  static delete(id) {
    const index = jobs.findIndex((j) => j.id == id); // Find the index of the job to delete
    jobs.splice(index, 1); // Remove the job from the jobs array
  }

  // Static method to add an applicant to a job posting
  static addApplicant(obj, id) {
    const index = jobs.findIndex((job) => job.id == id); // Find the index of the job
    if (index !== -1) {
      // Check if the job exists
      jobs[index].applicants = jobs[index].applicants || []; // Initialize applicants array if it doesn't exist
      jobs[index]?.applicants.push({
        id: jobs[index]?.applicants.length + 1, // Assign a new applicant ID
        ...obj, // Add the new applicant's data
      });
    }
  }
}

// Array to hold job postings
var jobs = [
  {
    id: 1,
    job_category: "Tech",
    job_designation: "MERN Developer",
    job_location: "Bangalore",
    company_name: "Coding Ninjas",
    salary: "12 -14 lpa",
    number_of_openings: "1",
    skills_required: ["React", "Angular", "SpringBoot"],
    apply_by: "2024-10-13",
    userEmail: "niki@test.com",
    userName: "Nikita",
    posted_on: "06/10/2024, 09:02:03 pm",
    applicants: [
      {
        id: 1,
        name: "Nikita",
        email: "nikita@test.com",
        contact: "837208302",
        resume: "/resumes/1728730587758-NikitaGuptaResume.pdf",
      },
    ],
  },
  {
    id: 2,
    job_category: "Tech",
    job_designation: "MERN Developer",
    job_location: "Gwalior, Madhya Pradesh",
    company_name: "Twinleaves",
    salary: "21 LPA",
    number_of_openings: "10",
    skills_required: ["Angular", "SpringBoot"],
    apply_by: "2024-12-4",
    userEmail: "niki@gmail.com",
    userName: "User",
    posted_on: "06/10/2024, 01:10:03 am",
    applicants: [],
  },
];
