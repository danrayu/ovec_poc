import { injectable } from 'inversify';
import { Sequelize } from 'sequelize';

@injectable()
export class DataAccessService {
  private sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }
  
  public getMessage(): string {
    return 'Hello from MyService!';
  }
}
