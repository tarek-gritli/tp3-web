import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DeepPartial, ObjectLiteral } from 'typeorm';

@Injectable()
export abstract class BaseService<T extends ObjectLiteral> {
  protected constructor(protected readonly repository: Repository<T>) {}

  async create(dto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<T> {
    const entity = await this.repository.findOneBy({ id } as any);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: number, dto: DeepPartial<T>): Promise<T> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async delete(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.softRemove(entity);
  }
}
