import { IndicatorRepository } from "@repos/indicator";
import { Injectable } from "@nestjs/common";

@Injectable()
export class IndicatorService {
  constructor(private readonly indicatorRepository: IndicatorRepository) { }
}
