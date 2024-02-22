import { User } from '../entities';

export type UserProps = {
  [K in Exclude<
    keyof User,
    'checkFieldBeforeInsert' | 'checkFieldBeforeUpdate'
  >]: User[K];
};
