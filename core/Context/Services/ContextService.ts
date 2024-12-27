import { injectable } from "inversify";
import { Context } from "../Types/Context";

@injectable()
export class ContextService {
  public context: Context;
  constructor() {
    this.context = new Context()
  }
}