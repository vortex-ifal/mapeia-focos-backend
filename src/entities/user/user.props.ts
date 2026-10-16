import { RoleEntity } from '../role';

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  role?: RoleEntity;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
