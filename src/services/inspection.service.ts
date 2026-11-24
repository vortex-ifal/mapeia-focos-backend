import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  InspectionEntity,
  OccurrenceEntity,
  OccurrenceEventKey,
  OccurrenceHistoryBuilder,
  OccurrenceHistoryEntity,
  OccurrenceStatusKey,
} from '../entities';
import {
  AssignmentsRepository,
  InspectionsRepository,
  OccurrenceEventsRepository,
  OccurrencesRepository,
  OccurrenceStatusesRepository,
  type OccurrenceStatusTransition,
} from '../repositories';

@Injectable()
export class InspectionService {
  constructor(
    private readonly inspectionsRepository: InspectionsRepository,
    private readonly occurrencesRepository: OccurrencesRepository,
    private readonly assignmentsRepository: AssignmentsRepository,
    private readonly occurrenceStatusesRepository: OccurrenceStatusesRepository,
    private readonly occurrenceEventsRepository: OccurrenceEventsRepository,
  ) {}

  async saveDraft(
    occurrenceId: string,
    agentId: string,
    draftInput: InspectionEntity,
  ): Promise<InspectionEntity> {
    await this.validateOccurrenceAndAgentAccess(occurrenceId, agentId);
    return this.inspectionsRepository.upsertDraft(draftInput);
  }

  async getDraft(
    occurrenceId: string,
    agentId: string,
  ): Promise<InspectionEntity> {
    await this.validateOccurrenceAndAgentAccess(occurrenceId, agentId);

    const draft =
      await this.inspectionsRepository.findDraftByOccurrenceAndAgent(
        occurrenceId,
        agentId,
      );
    if (!draft) {
      throw new NotFoundException(
        'Nenhum rascunho de vistoria encontrado para esta ocorrência',
      );
    }

    return draft;
  }

  async complete(
    occurrenceId: string,
    agentId: string,
    input: InspectionEntity,
  ): Promise<InspectionEntity> {
    const occurrence = await this.validateOccurrenceAndAgentAccess(
      occurrenceId,
      agentId,
    );

    const existingDraft =
      await this.inspectionsRepository.findDraftByOccurrenceAndAgent(
        occurrenceId,
        agentId,
      );

    let statusTransition: OccurrenceStatusTransition | undefined;
    let historyEntity: OccurrenceHistoryEntity | undefined;

    if (input.shouldResolveOccurrence()) {
      const previousStatusId = occurrence.status?.id;
      if (!previousStatusId) {
        throw new InternalServerErrorException(
          'Status atual da ocorrência não identificado no sistema',
        );
      }

      const resolvedStatus = await this.occurrenceStatusesRepository.findByKey(
        OccurrenceStatusKey.RESOLVED,
      );
      if (!resolvedStatus?.id) {
        throw new InternalServerErrorException(
          'Status "resolved" não encontrado no sistema',
        );
      }

      const inspectionEvent = await this.occurrenceEventsRepository.findByKey(
        OccurrenceEventKey.INSPECTION_PERFORMED,
      );
      if (!inspectionEvent?.id) {
        throw new InternalServerErrorException(
          'Evento "inspection_performed" não encontrado no sistema',
        );
      }

      statusTransition = {
        previousStatusId,
        newStatusId: resolvedStatus.id,
      };
      historyEntity = OccurrenceHistoryBuilder.create()
        .withOccurrenceId(occurrenceId)
        .withEventId(inspectionEvent.id)
        .withUserId(agentId)
        .build();
    }

    const completed = await this.inspectionsRepository.completeWithStatusUpdate(
      input,
      existingDraft?.id,
      statusTransition,
      historyEntity,
    );

    if (!completed) {
      throw new ConflictException(
        'Não foi possível concluir a vistoria devido a uma alteração concorrente na ocorrência',
      );
    }

    return completed;
  }

  async findByOccurrenceId(occurrenceId: string): Promise<InspectionEntity[]> {
    const occurrence = await this.occurrencesRepository.findById(occurrenceId);
    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada no sistema');
    }

    return this.inspectionsRepository.findByOccurrenceId(occurrenceId);
  }

  private async validateOccurrenceAndAgentAccess(
    occurrenceId: string,
    agentId: string,
  ): Promise<OccurrenceEntity> {
    const occurrence = await this.occurrencesRepository.findById(occurrenceId);
    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada no sistema');
    }

    if (occurrence.archivedAt) {
      throw new ConflictException(
        'Ocorrências arquivadas não podem ser vistoriadas',
      );
    }

    if (
      occurrence.status?.key !== OccurrenceStatusKey.FORWARDED_FOR_INSPECTION
    ) {
      throw new ConflictException(
        'Apenas ocorrências encaminhadas para vistoria (forwarded_for_inspection) podem ser vistoriadas',
      );
    }

    const latestAssignment =
      await this.assignmentsRepository.findLatestByOccurrenceId(occurrenceId);
    if (!latestAssignment || latestAssignment.agentId !== agentId) {
      throw new ForbiddenException(
        'Apenas o agente responsável atribuído à ocorrência pode registrar vistorias',
      );
    }

    return occurrence;
  }
}
