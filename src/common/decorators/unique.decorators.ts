import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [entity, field] = args.constraints;

    // getRepository works for any entity if it's registered in the DataSource
    const repository: Repository<any> = this.dataSource.getRepository(entity);

    const record = await repository.findOne({
      where: { [field]: value },
    });

    return !record;
  }

  defaultMessage(args: ValidationArguments): string {
    const [entity, field] = args.constraints;
    return `${field} must be unique`;
  }
}

export function IsUnique(
  entity: Function,
  field: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, field],
      validator: IsUniqueConstraint,
    });
  };
}
