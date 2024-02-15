import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleDto, UpdateModuleDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from './entities/module.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) {}

  create(createModuleDto: CreateModuleDto) {
    const module = this.moduleRepository.create(createModuleDto);
    return this.moduleRepository.save(module);
  }

  findAll() {
    return this.moduleRepository.find();
  }

  async findOne(id: number) {
    const module = await this.moduleRepository.findOneBy({ id });
    if (!module) throw new NotFoundException(`Module with ${id} not found`);

    return module;
  }

  async update(id: number, updateModuleDto: UpdateModuleDto) {
    const module = await this.findOne(id);

    const moduleToUpdate = this.moduleRepository.create(
      this.moduleRepository.merge(module, updateModuleDto),
    );

    return await this.moduleRepository.save(moduleToUpdate);
  }

  async remove(id: number) {
    const module = await this.findOne(id);
    await this.moduleRepository.remove(module);
  }
}
