import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: '아이디',
    example: 'test',
  })
  @IsNotEmpty({
    message: '아이디를 입력해주세요.',
  })
  @IsString({
    message: '아이디는 문자열이어야 합니다.',
  })
  id!: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'test',
  })
  @IsNotEmpty({
    message: '비밀번호를 입력해주세요.',
  })
  @IsString({
    message: '비밀번호는 문자열이어야 합니다.',
  })
  password!: string;
}
