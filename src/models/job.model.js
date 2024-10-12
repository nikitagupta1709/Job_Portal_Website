export default class JobModel {
  constructor(
    id,
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
  ) {
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

  static getAll() {
    return jobs;
  }

  static add(
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
  ) {
    let newJob = new JobModel(
      jobs.length + 1,
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
    jobs.push(newJob);
  }

  static getJobById(id) {
    return jobs.find((job) => job.id == id);
  }

  static update(obj) {
    console.log("obj", obj);
    const index = jobs.findIndex((p) => p.id == obj.id);
    jobs[index] = {
      ...jobs[index], // Keep the existing fields
      ...obj, // Overwrite only the fields that are in the obj (new data)
    };
  }

  static delete(id) {
    const index = jobs.findIndex((j) => j.id == id);
    jobs.splice(index, 1);
  }

  static addApplicant(obj, id) {
    const index = jobs.findIndex((job) => job.id == id);
    if (index !== -1) {
      jobs[index].applicants = jobs[index].applicants || [];
      jobs[index]?.applicants.push({
        id: jobs[index]?.applicants.length + 1,
        ...obj,
      });
    }
  }
}

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
    apply_by: "2024-10-03",
    userEmail: "niki@test.com",
    userName: "Nikita",
    posted_on: "06/10/2024, 09:02:03 pm",
    applicants: [
      {
        id: 1,
        name: "Nikita",
        email: "email",
        contact: "837208302",
        resume: "https://sidjgisjdg.com",
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
