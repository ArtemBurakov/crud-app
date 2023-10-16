import * as process from 'process';
import { registerAs } from '@nestjs/config';

import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';

export default registerAs('database', () => {
  return {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Post],
    synchronize: process.env.DB_SYNCHRONIZE,
    logging: process.env.DB_LOGGING,
  };
});
