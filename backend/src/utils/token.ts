const crypto = require("crypto");

/**
 * Generate a random token for workspace invites
 * @returns {string} A random token
 */
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

module.exports = {
  generateToken,
};
