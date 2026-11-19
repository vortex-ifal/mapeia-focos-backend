import { ApiProperty } from '@nestjs/swagger';

export class OccurrenceHistoryAuthorResponseDto {
  @ApiProperty({
    description: 'Identificador único do usuário autor da ação',
    example: '01a1427d-b040-7e49-80fa-a069e39f36fd',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do usuário autor da ação',
    example: 'Gestor Geral',
  })
  name: string;
}

export class OccurrenceHistoryResponseDto {
  @ApiProperty({
    description: 'Identificador único do registro de histórico na linha do tempo',
    example: '01a1478e-1c4a-7999-8001-d10ebf63fc01',
  })
  id: string;

  @ApiProperty({
    description: 'Chave identificadora estável do tipo de evento',
    example: 'status_updated',
  })
  eventKey: string;

  @ApiProperty({
    description: 'Descrição legível do evento ocorrido',
    example: 'Status da ocorrência alterado',
  })
  eventDescription: string;

  @ApiProperty({
    description:
      'Dados do usuário autor da ação. Nulo caso a ação tenha sido realizada pelo sistema.',
    type: OccurrenceHistoryAuthorResponseDto,
    nullable: true,
  })
  author: OccurrenceHistoryAuthorResponseDto | null;

  @ApiProperty({
    description: 'Data e hora em que a ação/evento foi registrado',
    example: '2026-11-18T18:41:55.000Z',
  })
  createdAt: Date;
}
