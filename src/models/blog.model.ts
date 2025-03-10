import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Blog extends Entity {
  @property({
    type: 'number', // ✅ ID should be a number
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  content: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['draft', 'published', 'archived'],
    },
    default: 'draft',
  })
  status: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  tags?: string[];

  @property({
    type: 'number',
    default: 0,
  })
  views?: number;

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

  @belongsTo(() => User) // ✅ Ensures correct belongsTo relation
  authorId: number; // ✅ Must be a number to match User.id

  constructor(data?: Partial<Blog>) {
    super(data);
  }
}
