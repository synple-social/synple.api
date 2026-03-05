import { Injectable } from "@nestjs/common";
import { v7 } from "uuid"

@Injectable()
export class UuidsService {
  public generate(): string {
    return v7()
  }
}