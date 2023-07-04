import { Injectable, inject } from "@angular/core";
import { LoggerService } from "./logger.service";

@Injectable({
  providedIn: "root",
})
export class CalculatorService {
  private logger = inject(LoggerService);
  constructor() {}

  add(n1: number, n2: number) {
    this.logger.log("Addition operation called");
    return n1 + n2;
  }

  subtract(n1: number, n2: number) {
    this.logger.log("Subtraction operation called");
    return n1 - n2;
  }
}
