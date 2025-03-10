import {Entity, hasMany, model, property} from '@loopback/repository';
import {Blog} from './blog.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  mobile: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'boolean',
    default: false,
  })
  emailVerified?: boolean;

  @property({
    type: 'string',
    required: false,
  })
  verificationToken?: string;

  @property({
    type: 'string',
    required: false,
  })
  googleId?: string; // Store Google OAuth ID

  @property({
    type: 'string',
    required: false,
  })
  facebookId?: string; // Store Facebook OAuth ID

  @property({
    type: 'string',
    required: false,
  })
  githubId?: string; // Store GitHub OAuth ID

  @property({
    type: 'string',
  })
  bio?: string;

  @property({
    type: 'string',
  })
  avatar?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['admin', 'author', 'reader'],
    },
  })
  role: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  createdAt?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  updatedAt?: string;

  @hasMany(() => Blog, {keyTo: 'authorId'})
  blogs: Blog[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
