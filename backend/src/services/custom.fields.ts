const { prisma } = require("../lib/prisma.ts");

export interface CustomField {
  id: string;
  name: string;
  type: "text" | "number" | "boolean" | "select" | "multi-select";
  options?: string[];
  required: boolean;
  entityType: "role" | "user" | "team";
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    customValidator?: string;
  };
}

export class CustomFieldService {
  private async validateCustomField(field: CustomField): Promise<void> {
    // Implement validation logic
  }

  async addCustomField(workspaceId: string, field: Omit<CustomField, "id">) {
    await this.validateCustomField(field as CustomField);

    return await prisma.customField.create({
      data: {
        ...field,
        workspaceId,
      },
    });
  }

  async getFieldValues(entityId: string, entityType: string) {
    return await prisma.customFieldValue.findMany({
      where: {
        entityId,
        field: {
          entityType,
        },
      },
      include: {
        field: true,
      },
    });
  }
}
