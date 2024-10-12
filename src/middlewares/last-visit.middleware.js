// Middleware to manage the last visit cookie for users
export const settingLastVisit = (req, res, next) => {
  // Check if the 'lastVisit' cookie exists
  if (req.cookies.lastVisit) {
    // If it exists, convert the cookie value to a Date object and format it to a locale string
    res.locals.lastVisit = new Date(req.cookies.lastVisit).toLocaleString(); // Store the formatted date in locals for use in views
  }

  // Set a new cookie for the current visit timestamp
  res.cookie("lastVisit", new Date().toISOString(), {
    maxAge: 2 * 24 * 60 * 60 * 1000, // Set the cookie to expire in 2 days
    httpOnly: true, // Optional: prevents client-side JavaScript from accessing the cookie for security
  });

  // Proceed to the next middleware or route handler
  next();
};
