import { ApiProperty } from '@nestjs/swagger';
import { RolesPermissions } from '../../roles/entities/roles_permission.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PermissionType {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
  ALL = 'ALL',
}

@Entity('permissions')
export class Permission {
  @ApiProperty({
    example: 4,
    description: 'Id del permiso',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'CREAR',
    description: 'Nombre del permiso',
    uniqueItems: true,
  })
  @Column('varchar', {
    unique: true,
  })
  name: string;

  @ApiProperty({
    example: 'POST',
    description: 'Tipo de permiso',
    enum: PermissionType,
    uniqueItems: true,
  })
  @Column({
    type: 'enum',
    enum: PermissionType,
    unique: true,
  })
  type: PermissionType;

  @OneToMany(
    () => RolesPermissions,
    (rolesPermissions) => rolesPermissions.permission,
  )
  rolePermissions: RolesPermissions[];

  @BeforeInsert()
  checkNameToInsert() {
    this.name = this.name.trim().toUpperCase();
  }

  @BeforeUpdate()
  checkNameToUpdate() {
    this.checkNameToInsert();
  }
}
