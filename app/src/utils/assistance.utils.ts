import { VALID_ASSISTANCE_TYPES } from "@/constants/assistance.constants";
import { AssistanceType } from "@/types/assistance.types";

export function isValidAssistanceType(type: string): type is AssistanceType {
  return VALID_ASSISTANCE_TYPES.includes(type as AssistanceType);
}
