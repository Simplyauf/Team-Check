export enum PromptType {
  CHECKIN = "CHECKIN",
  CHECKOUT = "CHECKOUT",
}

export enum ResponseType {
  TEXT = "TEXT",
  URL = "URL",
  NUMBER = "NUMBER",
  PROJECT_SELECT = "PROJECT_SELECT",
  VIDEO_URL = "VIDEO_URL",
}

export enum CheckInStatus {
  PENDING = "PENDING",
  CHECKED_IN = "CHECKED_IN",
  CHECKED_OUT = "CHECKED_OUT",
}

export interface CheckInPrompt {
  id?: string;
  promptType: PromptType;
  question: string;
  responseType: ResponseType;
  isRequired: boolean;
  order: number;
}

export interface CheckInResponse {
  promptId: string;
  question: string;
  answer: string | number;
}

export interface CheckInSettings {
  checkInTime: string;
  checkOutTime: string;
  isEnabled: boolean;
  defaultPrompts: boolean;
  prompts: CheckInPrompt[];
}

export const DEFAULT_CHECKIN_PROMPTS: CheckInPrompt[] = [
  {
    promptType: PromptType.CHECKIN,
    question: "Which projects are you working on today?",
    responseType: ResponseType.PROJECT_SELECT,
    isRequired: true,
    order: 1,
  },
  {
    promptType: PromptType.CHECKIN,
    question: "What are you working on today?",
    responseType: ResponseType.TEXT,
    isRequired: true,
    order: 2,
  },
  {
    promptType: PromptType.CHECKOUT,
    question: "Which projects did you work on today?",
    responseType: ResponseType.PROJECT_SELECT,
    isRequired: true,
    order: 1,
  },
  {
    promptType: PromptType.CHECKOUT,
    question: "What did you work on today?",
    responseType: ResponseType.TEXT,
    isRequired: true,
    order: 2,
  },
  {
    promptType: PromptType.CHECKOUT,
    question: "Demo video of what you did today",
    responseType: ResponseType.VIDEO_URL,
    isRequired: true,
    order: 3,
  },
];
