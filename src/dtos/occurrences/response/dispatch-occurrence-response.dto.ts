import { ApiProperty } from '@nestjs/swagger';

export class DispatchStatusDto {
  @ApiProperty({ example: 'forwarded_for_inspection' })
  key: string;

  @ApiProperty({ example: 'Encaminhada para Vistoria' })
  name: string;
}

export class DispatchOccurrenceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: 'ID do agente responsável' })
  agentId: string;

  @ApiProperty({ type: DispatchStatusDto })
  status: DispatchStatusDto;
}
