export const settingLastVisit = (req, res, next) => {
  // Use req.cookies instead of req.cookie
  if (req.cookies.lastVisit) {
    res.locals.lastVisit = new Date(req.cookies.lastVisit).toLocaleString(); // Set locals.lastVisit correctly
  }

  // Set a new cookie for last visit
  res.cookie("lastVisit", new Date().toISOString(), {
    maxAge: 2 * 24 * 60 * 60 * 1000, // Cookie expires in 2 days
    httpOnly: true, // Optional: prevents client-side JavaScript from accessing the cookie
  });

  next();
};
