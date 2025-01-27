import { CustomField } from "../services/custom.fields";
import { RoleType } from "./role";

type BaseValidation = CustomField["validation"];

interface RoleValidationExtension {
  permissionCheck?: string[];
  teamScope?: boolean;
  departmentScope?: boolean;
}

interface RoleCustomField {
  id: string;
  name: string;
  type: CustomField["type"];
  options?: string[];
  required: boolean;
  entityType: "role";
  applicableTo?: RoleType[];
  inheritance?: "inherit" | "override" | "merge";
  validation?: BaseValidation & RoleValidationExtension;
}
