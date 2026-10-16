import { RoleEntity } from './role.entity';
import { RoleProps } from './role.props';

export class RoleBuilder {
  private props: RoleProps;

  constructor() {
    this.props = {
      name: '',
    };
  }

  static create(): RoleBuilder {
    return new RoleBuilder();
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withName(name: string): this {
    this.props.name = name;
    return this;
  }

  build(): RoleEntity {
    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new Error('Name is required to build a RoleEntity');
    }

    return new RoleEntity(this.props);
  }
}
