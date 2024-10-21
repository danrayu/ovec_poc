import { injectable } from 'inversify';

@injectable()
export class MyService {
  public getMessage(): string {
    return 'Hello from MyService!';
  }
}
