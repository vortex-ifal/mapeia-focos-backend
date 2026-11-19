export interface OccurrenceHistoryAuthorReadModel {
  id: string;
  name: string;
}

export interface OccurrenceHistoryReadModel {
  id: string;
  eventKey: string;
  eventDescription: string;
  author: OccurrenceHistoryAuthorReadModel | null;
  createdAt: Date;
}
