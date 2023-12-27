import {
  Challenge,
  ChallengeCalculationType,
  Task,
  Unit,
} from "../../schema";

interface ChallengeCompletionData {
  amountComplete: number;
  amountRequired: number;
  percentComplete: number;
}

export interface ChallengeRequirement {
  id?: number;
  challenge?: Challenge;
  challengeId?: number;
  task?: Task;
  taskId?: number;
  habitId?: number;
  unit?: Unit;
  unitId?: number;
  calculationType?: ChallengeCalculationType;
  calculationIntervalDays?: number;
  requiredIntervalQuantity?: number;
  requiredTaskQuantity?: number;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
