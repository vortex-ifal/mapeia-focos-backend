import { UserEntity } from './user.entity';
import { UserProps, UserRole } from './user.props';

export class UserBuilder {
  private props: UserProps;

  constructor() {
    this.props = {
      name: '',
      email: '',
      password: '',
      role: 'citizen',
      isActive: true,
    };
  }

  static create(): UserBuilder {
    return new UserBuilder();
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withName(name: string): this {
    this.props.name = name;
    return this;
  }

  withEmail(email: string): this {
    this.props.email = email;
    return this;
  }

  withPassword(password: string): this {
    this.props.password = password;
    return this;
  }

  withCpf(cpf?: string | null): this {
    this.props.cpf = cpf;
    return this;
  }

  withRole(role?: UserRole): this {
    this.props.role = role ?? 'citizen';
    return this;
  }

  withIsActive(isActive?: boolean): this {
    this.props.isActive = isActive ?? true;
    return this;
  }

  withCreatedAt(createdAt?: Date): this {
    this.props.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt?: Date): this {
    this.props.updatedAt = updatedAt;
    return this;
  }

  build(): UserEntity {
    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new Error('Name is required to build a UserEntity');
    }
    if (!this.props.email || this.props.email.trim().length === 0) {
      throw new Error('Email is required to build a UserEntity');
    }
    if (!this.props.password || this.props.password.trim().length === 0) {
      throw new Error('Password is required to build a UserEntity');
    }

    return new UserEntity(this.props);
  }
}
