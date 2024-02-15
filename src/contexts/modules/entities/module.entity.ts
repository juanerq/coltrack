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

@Entity('modules')
export class Module {
  @ApiProperty({
    example: 1,
    description: 'Id del modulo',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Gestion de ubicaciones',
    description: 'Nombre del modulo',
    uniqueItems: true,
  })
  @Column('varchar', {
    unique: true,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    example: 'gestion-de-ubicaciones',
    description: 'Detalle del modulo',
    uniqueItems: true,
  })
  @Column('varchar', {
    unique: true,
  })
  detail: string;

  @OneToMany(
    () => RolesPermissions,
    (rolesPermissions) => rolesPermissions.module,
  )
  rolePermissions: RolesPermissions[];

  @BeforeInsert()
  checkNameToInsert() {
    if (!this.detail) this.detail = this.name;

    this.detail = this.detail.trim().toLowerCase().replaceAll(' ', '-');
  }

  @BeforeUpdate()
  checkNameToUpdate() {
    this.checkNameToInsert();
  }
}
