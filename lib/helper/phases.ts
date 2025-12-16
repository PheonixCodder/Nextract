import { ExecutionPhase } from "@/lib/generated/prisma";

type Phase = Pick<ExecutionPhase, "creditsConsumed">;

export const GetPhasesTotalCost = (phases: Phase[]) => {
  return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
};