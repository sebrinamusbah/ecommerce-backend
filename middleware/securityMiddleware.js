// middleware/securityMiddleware.js
const helmet = require("helmet");

const securityMiddleware = [
  // Basic security headers
  helmet(),

  // Custom security headers
  (req, res, next) => {
    // Prevent MIME type sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Clickjacking protection
    res.setHeader("X-Frame-Options", "DENY");

    // XSS protection
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // Referrer policy
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Content Security Policy
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    );

    // HSTS (in production)
    if (process.env.NODE_ENV === "production") {
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains",
      );
    }

    next();
  },
];

module.exports = securityMiddleware;
