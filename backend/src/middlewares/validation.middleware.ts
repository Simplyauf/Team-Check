const { ZodError } = require("zod");
const { AppError } = require("../utils/AppError.ts");

const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  };
};

module.exports = { validateRequest };
