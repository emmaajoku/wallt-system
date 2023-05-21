import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  ADMIN,
  CUSTOMER,
}

registerEnumType(Role, {
  name: 'Role',
  description: 'Roles supported by the application',
  valuesMap: {
    ADMIN: { description: 'Administrators' },
    CUSTOMER: { description: 'Registered Employee' },
  },
});
