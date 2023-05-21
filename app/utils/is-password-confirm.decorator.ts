import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsPasswordConfirmed(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string): void => {
    registerDecorator({
      name: 'IsPasswordConfirmed',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            value === relatedValue
          );
        },
      },
    });
  };
}
