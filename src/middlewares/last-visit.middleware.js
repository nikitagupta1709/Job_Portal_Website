// Middleware to manage the last visit cookie for users
export const settingLastVisit = (req, res, next) => {
  // Check if the 'lastVisit' cookie exists
  if (req.cookies.lastVisit) {
    // Store the last visit as UTC in res.locals (no need to format yet)
    res.locals.lastVisit = req.cookies.lastVisit; // Use UTC directly
  }

  // Set a new cookie for the current visit in UTC format
  res.cookie("lastVisit", new Date().toISOString(), {
    // ISOString is in UTC
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days expiration
    httpOnly: true,
  });

  // Proceed to the next middleware or route handler
  next();
};
