export enum AgentWorklistOrderBy {
  STATUS = 'status',
  ADDRESS = 'address',
}

export interface AgentWorklistFilters {
  orderBy?: AgentWorklistOrderBy;
}
