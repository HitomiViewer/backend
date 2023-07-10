import { UserEntity } from '../entities/user.entity';

export const UserProperties = ['id'] as const;

export type User = Pick<UserEntity, typeof UserProperties[number]>;

export function extractUser(user: User): User {
  return UserProperties.reduce(
    (acc, property) => ((acc[property] = user[property]), acc),
    {} as any,
  );
}
