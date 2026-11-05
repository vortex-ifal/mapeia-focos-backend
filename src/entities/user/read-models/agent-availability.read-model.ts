export interface AgentAvailabilityReadModel {
  agentId: string;
  name: string;
  sectorRegion: string | null;
  totalActiveTasks: number;
}
