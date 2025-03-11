import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  Response,
  response,
  RestBindings,
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';

import {inject} from '@loopback/core';
import {v4 as uuidv4} from 'uuid';
import {EmailService} from '../services';

export class UserController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @repository(UserRepository) public userRepository: UserRepository,
    @inject('services.EmailService') private emailService: EmailService,
  ) { }

  @post('/users')
  @response(201, {
    description: 'User registration response',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: {type: 'string'},
            message: {type: 'string'},
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<object> {

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({where: {email: user.email}});
    if (existingUser) {
      return {status: 'error', message: 'Email already in use'}; // Consistent response format
    }

    // Generate verification token
    const verificationToken = uuidv4();
    user.verificationToken = verificationToken;

    // Create new user
    const newUser = await this.userRepository.create(user);

    // Attempt to send verification email
    let status = 'success';
    let message = 'Registration successful! Please verify your email.';
    try {
      await this.emailService.sendVerificationEmail(newUser.email, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      status = 'warning';
      message = 'Registration successful, but email verification failed. Please request a new verification email.';
    }

    return {status, message};
  }

  // GET /verify-email?token=your_generated_token
  @get('/verify-email')
  async verifyEmail(@param.query.string('token') token: string): Promise<object> {
    const user = await this.userRepository.findOne({where: {verificationToken: token}});

    if (!user) {
      return {error: 'Invalid or expired token'};
    }

    await this.userRepository.updateById(user.id, {emailVerified: true, verificationToken: 'null'});

    return {status: 'success', message: 'Email successfully verified! You can now log in.'};
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
