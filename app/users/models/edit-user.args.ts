import { ArgsType, Field } from '@nestjs/graphql';
import {
  IsMongoId,
  IsNotEmpty,
  Matches,
  MinLength,
  IsOptional,
} from 'class-validator';

@ArgsType()
export class EditUserArgs {
  @MinLength(2)
  @IsMongoId()
  @IsNotEmpty()
  @Field(() => String, {
    description: 'The user id of the user to be modified',
  })
  userId: string;

  @MinLength(2)
  @Field(() => String, {
    description: 'The last name to to set for this user',
  })
  lastName: string;

  @MinLength(2)
  @Field(() => String, {
    description: 'The first name to to set for this user',
  })
  firstName: string;

  @MinLength(2)
  @Field(() => String, {
    description: 'The phone number to to set for this user',
  })
  @Matches(
    /^\+?((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    { message: 'Phone number is invalid' },
  )
  phoneNumber: string;

  @Field(() => String, {
    description: 'The image url to set as avatar for this user',
    nullable: true,
  })
  @IsOptional()
  avatarUrl?: string;
}
