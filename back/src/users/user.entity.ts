import { Column, Entity } from 'typeorm';

import { Base } from 'src/utils';

@Entity()
export class User extends Base<number> {
  @Column()
  login: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  password: string;
}