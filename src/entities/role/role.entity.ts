import { RoleProps } from './role.props';

export class RoleEntity {
  private readonly _id?: string;
  private readonly _name: string;

  constructor(props: RoleProps) {
    this._id = props.id;
    this._name = props.name;
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}
