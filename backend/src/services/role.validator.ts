import AppError from "utils/AppError";

interface RoleValidationRule {
  type: "permission" | "hierarchy" | "scope" | "custom";
  check: (role: any) => Promise<boolean>;
  errorMessage: string;
}

class RoleValidator {
  async validateCustomRole(role: any, rules: RoleValidationRule[]) {
    const failures = [];

    for (const rule of rules) {
      const isValid = await rule.check(role);
      if (!isValid) {
        failures.push(rule.errorMessage);
      }
    }

    if (failures.length > 0) {
      throw new AppError(`Role validation failed: ${failures.join(", ")}`, 400);
    }
  }
}
