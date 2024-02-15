import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

// Services
import { PermissionsService } from '../permissions/permissions.service';
import { ModulesService } from '../modules/modules.service';

// Dtos
import {
  RemovePermissionsRoleDto,
  AddPermissionsRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
} from './dto';

// Entitys
import { Role, RolesPermissions } from './entities';
import { RolePermissions } from './interfaces/permissions.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(RolesPermissions)
    private readonly rolesPermissionsRepository: Repository<RolesPermissions>,

    private readonly permissionService: PermissionsService,
    private readonly modulesService: ModulesService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);

    return role;
  }

  async addPermission(
    id: number,
    addPermissionsRoleDto: AddPermissionsRoleDto,
  ) {
    const role = await this.findOneSimple(id);

    const permission = await this.permissionService.findOne(
      addPermissionsRoleDto.permissionId,
    );
    const module = await this.modulesService.findOne(
      addPermissionsRoleDto.moduleId,
    );

    const rolesPermissions = this.rolesPermissionsRepository.create({
      role,
      permission,
      module,
    });
    return await this.rolesPermissionsRepository.save(rolesPermissions);
  }

  async findAllByIds(ids: number[]) {
    return await this.roleRepository.findBy({ id: In(ids) });
  }

  async findOneSimple(id: number) {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException(`Role with ${id} not found`);

    return role;
  }

  async findOne(id: number): Promise<RolePermissions> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    const role = await queryBuilder
      .distinctOn(['rolePermissions.module'])
      .select(['role.id', 'role.name'])
      .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
      .leftJoinAndSelect('rolePermissions.module', 'module')
      .where({ id })
      .getOne();

    if (!role) throw new NotFoundException(`Role with ${id} not found`);

    const permissionsList = await this.permissionService.findAll();

    const modules = [];

    for (const rolePermission of role.rolePermissions) {
      const { module } = rolePermission;

      const permissionsData = await this.rolesPermissionsRepository.findBy({
        module,
        role,
      });

      const permissions = permissionsData.map((permission) => {
        return permissionsList.find(
          (item) => item.id === permission.permissionId,
        );
      });

      modules.push({
        id: module.id,
        name: module.name,
        detail: module.detail,
        permissions,
      });
    }

    return {
      id: role.id,
      name: role.name,
      modules,
    };
  }

  async findAll() {
    return this.roleRepository.find();
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id);

    const role = this.roleRepository.create(updateRoleDto);
    return await this.roleRepository.update(id, role);
  }

  async remove(id: number) {
    const role = await this.findOneSimple(id);
    await this.roleRepository.remove(role);
  }

  async removePermission(
    id: number,
    removePermissionsRoleDto: RemovePermissionsRoleDto,
  ) {
    await this.rolesPermissionsRepository
      .createQueryBuilder()
      .delete()
      .where({ roleId: id, ...removePermissionsRoleDto })
      .execute();
  }
}
