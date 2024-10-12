import JobModel from "../models/job.model.js"; // Import the JobModel for fetching job listings
import UserModal from "../models/user.model.js"; // Import the UserModel for user-related operations

export default class UserController {
  // Handle user registration
  postRegister(req, res) {
    const { name, email, password } = req.body; // Destructure user data from the request body

    // Check if the user already exists based on the provided email
    var user = UserModal.isUserExist(email);
    if (user) {
      // If the user exists, render the landing page with an error message
      return res.render("landing", {
        errorMessage: "Email already registered",
      });
    }

    // If the user does not exist, add the new user to the database
    UserModal.add(name, email, password);
    // Redirect to the login page after successful registration
    res.redirect("/login");
  }

  // Handle user login
  postLogin(req, res) {
    const { email, password } = req.body; // Destructure user credentials from the request body

    // Validate user credentials
    const user = UserModal.isValidUSer(email, password);
    if (!user) {
      // If the user is not found, render an error page
      return res.status(404).render("error", {
        errorMessage: "User not found, please register",
      });
    }

    // Store user information in the session for later use
    req.session.userEmail = user.email;
    req.session.userName = user.name;

    // Fetch all job listings to display after successful login
    var jobs = JobModel.getAll();
    res.render("job-listing", {
      jobs, // Pass the jobs data to the view
      userEmail: req.session.userEmail, // Pass the user's email to the view
      userName: req.session.userName, // Pass the user's name to the view
      errorMessage: null, // No error message initially
    });
  }

  // Handle user logout
  logout(req, res) {
    // On logout, destroy the session to log out the user
    req.session.destroy((err) => {
      if (err) {
        // If an error occurs during session destruction, log the error
        console.log(err);
      } else {
        // If logout is successful, redirect to the login page
        res.redirect("/login");
      }
    });

    // Clear the last visit cookie for user privacy
    res.clearCookie("lastVisit");
  }
}
