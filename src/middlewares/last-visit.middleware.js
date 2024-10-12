export const settingLastVisit = (req, res, next) => {
  if (req.cookie.lastVisit) {
    res.local.lastVisit = new Date(req.cookie.lastVisit).toLocaleString();
  }
  res.cookie("lastVisit", new Date().toISOString(), {
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });
  next();
};
