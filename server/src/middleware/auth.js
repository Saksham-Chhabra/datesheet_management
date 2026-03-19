const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).send("Not logged in");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

function isCollegeEmail(email) {
  const allowedDomains = process.env.ALLOWED_DOMAINS.split(",");
  const domain = email.split("@")[1];
  return allowedDomains.includes(domain);
}
