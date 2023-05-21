import { ArgsType, Field } from '@nestjs/graphql';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';

@ArgsType()
export class DeleteByIdArgs {
  @Field(() => String, {
    description: 'The id to use for the operation',
  })
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}

@ArgsType()
export class DeleteByIdsArgs {
  @Field(() => [String], {
    description: 'The ids to use for the operation',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  ids: string[];
}

@ArgsType()
export class DeleteByIdArgs_Admin extends DeleteByIdArgs {
  @Field({
    description: 'The userId of the user to perform this operation for',
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}

@ArgsType()
export class DeletecustomersByIdArgs {
  @Field({
    description: 'The userId of the user record to delete',
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}
