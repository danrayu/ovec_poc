import { controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';

@controller('/')
export class MyController {

  @httpGet('/')
  public get(): string {
    return "hello";
  }
}
