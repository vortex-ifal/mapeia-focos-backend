import { RoleEntity } from '../role';
import { UserProps } from './user.props';

export class UserEntity {
  private readonly _id?: string;
  private readonly _name: string;
  private readonly _email: string;
  private readonly _password: string;
  private readonly _cpf: string;
  private readonly _role?: RoleEntity;
  private readonly _isActive: boolean;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  constructor(props: UserProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._cpf = props.cpf;
    this._role = props.role;
    this._isActive = props.isActive ?? true;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get cpf(): string {
    return this._cpf;
  }

  get role(): RoleEntity | undefined {
    return this._role;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
