import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// Entitys
import { Permission } from '../../permissions/entities/permission.entity';
import { Module } from '../../modules/entities/module.entity';
import { Role } from './role.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('roles_permissions')
@Unique(['role', 'module', 'permission'])
export class RolesPermissions {
  @ApiProperty({
    example: 1,
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 2,
    description: 'Id del rol',
  })
  @Column('int')
  roleId: number;

  @ApiProperty({
    example: 1,
    description: 'Id del modulo',
  })
  @Column('int')
  moduleId: number;

  @ApiProperty({
    example: 4,
    description: 'Id del permiso',
  })
  @Column('int')
  permissionId: number;

  @ApiProperty({
    type: () => Role,
    description: 'Rol',
  })
  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  role: Role;

  @ApiProperty({
    type: () => Module,
    description: 'Modulo',
  })
  @ManyToOne(() => Module, (module) => module.rolePermissions, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  module: Module;

  @ApiProperty({
    type: () => Permission,
    description: 'Permiso',
  })
  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  permission: Permission;
}
