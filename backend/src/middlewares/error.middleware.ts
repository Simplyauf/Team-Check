const AppError = require("../utils/AppError.ts");
const { logger } = require("../utils/logger.ts");

module.exports = {
  errorHandler: (err, req, res, next) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
    }

    logger.error(err.stack);

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  },
};
