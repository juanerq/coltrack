import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    example: 1,
    description: 'Id del usuario',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'User test',
    description: 'Nombre del usuario',
    minLength: 4,
  })
  @Column('varchar', {
    nullable: false,
  })
  fullName: string;

  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Correo del usuario',
  })
  @Column('varchar', {
    unique: true,
    nullable: false,
  })
  email: string;

  @ApiProperty({
    example: true,
    description: 'Estado del usuario',
  })
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('varchar', {
    nullable: false,
    select: false,
  })
  password: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => [Role],
  })
  @ManyToMany(() => Role, (role) => role.users, {
    cascade: true,
  })
  @JoinTable({ name: 'users_roles' })
  roles: Role[];

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }
}
