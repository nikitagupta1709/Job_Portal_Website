import JobModel from "../models/job.model.js";
import UserModal from "../models/user.model.js";

export default class UserController {
  postRegister(req, res) {
    const { name, email, password } = req.body;
    var user = UserModal.isUserExist(email);
    if (user) {
      return res.render("landing", {
        errorMessage: "Email already resgistered",
      });
    }
    UserModal.add(name, email, password);
    res.redirect("/login");
  }
  postLogin(req, res) {
    const { email, password } = req.body;
    const user = UserModal.isValidUSer(email, password);
    if (!user) {
      return res.status(404).render("error", {
        errorMessage: "user not found pls register",
      });
    }
    req.session.userEmail = user.email;
    req.session.userName = user.name;
    var jobs = JobModel.getAll();
    res.render("job-listing", {
      jobs,
      userEmail: req.session.userEmail,
      userName: req.session.userName,
      errorMessage: null,
    });
  }

  logout(req, res) {
    // on logout, destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/login");
      }
    });
    res.clearCookie("lastVisit");
  }
}
