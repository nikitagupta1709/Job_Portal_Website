import JobModel from "../models/job.model.js";

export const auth = (req, res, next) => {
  if (req.session.userEmail) {
    next();
  } else {
    res.render("error", {
      errorMessage:
        "only recruiter is allowed to access this page, login as recruiter to continue",
    });
  }
};

export const actionMiddleWare = (req, res, next) => {
  const id = req.params.id;
  const jobData = JobModel.getJobById(id);
  if (req.session.userEmail !== jobData?.userEmail) {
    return res.render("error", {
      errorMessage:
        "Access denied: You are not permitted to modify or remove this job posting.",
    });
  }
  next();
};
