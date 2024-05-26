import { IsNumber, IsString } from 'class-validator';

export class CreateProvinceDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly area: number;

  @IsNumber()
  readonly population: number;

  @IsNumber()
  readonly gdp: number;

  @IsNumber()
  readonly lat: number;

  @IsNumber()
  readonly lng: number;

  @IsString()
  readonly googleMapUrl: string;

  @IsString()
  readonly capital: string;

  @IsString()
  readonly description: string;

  @IsString({ each: true })
  readonly images: string[];
}
