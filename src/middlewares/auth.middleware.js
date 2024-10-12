import JobModel from "../models/job.model.js";

export const auth = (req, res, next) => {
  if (req.session.userEmail) {
    next();
  } else {
    res.status(404).render("error", {
      errorMessage:
        "only recruiter is allowed to access this page, login as recruiter to continue",
    });
  }
};

export const actionMiddleWare = (req, res, next) => {
  const id = req.params.id;
  const jobData = JobModel.getJobById(id);
  if (req.session.userEmail !== jobData?.userEmail) {
    return res.status(404).render("error", {
      errorMessage:
        "Access denied: You are not permitted to modify or remove this job posting.",
    });
  }
  next();
};

export const dateExpiredMidlleware = (req, res, next) => {
  const id = req.params.id;
  const jobFound = JobModel.getJobById(id);
  const currentDate = new Date();
  const applyByDate = new Date(jobFound?.apply_by);
  if (currentDate > applyByDate) {
    return res.status(404).render("error", {
      errorMessage: "The application deadline has passed.",
    });
  }
  next();
};
