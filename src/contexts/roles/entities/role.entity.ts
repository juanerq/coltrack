import { User } from '../../auth/entities';
import { RolesPermissions } from './roles_permission.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('roles')
export class Role {
  @ApiProperty({
    example: 2,
    description: 'Id del rol',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Nombre del rol',
    uniqueItems: true,
  })
  @Column('varchar', {
    unique: true,
    nullable: false,
  })
  name: string;

  @OneToMany(
    () => RolesPermissions,
    (rolesPermissions) => rolesPermissions.role,
  )
  rolePermissions: RolesPermissions[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @BeforeInsert()
  checkNameToInsert() {
    this.name = this.name.trim().toUpperCase();
  }

  @BeforeUpdate()
  checkNameToUpdate() {
    this.checkNameToInsert();
  }
}
