import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission, PermissionType } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async findAll() {
    return await this.permissionRepository.find();
  }

  async findOne(id: number) {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission)
      throw new NotFoundException(`Permission with id ${id} not found`);

    return permission;
  }

  getPermissionTypes() {
    return Object.values(PermissionType);
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.findOne(id);

    const permissionToUpdate = this.permissionRepository.create(
      this.permissionRepository.merge(permission, updatePermissionDto),
    );

    return await this.permissionRepository.save(permissionToUpdate);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    await this.permissionRepository.remove(role);
  }
}
