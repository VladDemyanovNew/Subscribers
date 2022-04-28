import { IsNumberString } from 'class-validator';

export class SubscriptionParamDto {

  @IsNumberString()
  readonly ownerId: number;

  @IsNumberString()
  readonly subscriberId: number;
}