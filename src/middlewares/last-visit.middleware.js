export const settingLastVisit = (req, res, next) => {
  if (req.cookies.lastVisit) {
    res.locals.lastVisit = req.cookies.lastVisit; // Keep the last visit in UTC format
  }

  const currentUTC = new Date().toISOString(); // Store current time in UTC

  // Set the 'lastVisit' cookie to the current UTC time
  res.cookie("lastVisit", currentUTC, {
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days expiration
    httpOnly: true,
  });

  next();
};
