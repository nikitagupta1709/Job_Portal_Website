import JobModel from "../models/job.model.js";
import UserModal from "../models/user.model.js";

export default class UserController {
  postRegister(req, res) {
    const { name, email, password } = req.body;
    UserModal.add(name, email, password);
  }
  postLogin(req, res) {
    const { email, password } = req.body;
    const user = UserModal.isValidUSer(email, password);
    if (!user) {
      return res.render("landing", {
        errorMessage: "Invalid user",
      });
    }

    req.session.userMail = email;
    var jobs = JobModel.getAll();
    res.render("index", {
      jobs,
      userEmail: req.session.userMail,
    });
    // JOBS list
  }
}
