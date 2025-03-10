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
  response,
} from '@loopback/rest';
import {Blog} from '../models';
import {BlogRepository} from '../repositories';

export class BlogController {
  constructor(
    @repository(BlogRepository)
    public blogRepository: BlogRepository,
  ) { }

  @post('/blogs')
  @response(200, {
    description: 'Blog model instance',
    content: {'application/json': {schema: getModelSchemaRef(Blog)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Blog, {
            title: 'NewBlog',
            exclude: ['id'],
          }),
        },
      },
    })
    blog: Omit<Blog, 'id'>,
  ): Promise<Blog> {
    return this.blogRepository.create(blog);
  }

  @get('/blogs/count')
  @response(200, {
    description: 'Blog model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Blog) where?: Where<Blog>,
  ): Promise<Count> {
    return this.blogRepository.count(where);
  }

  @get('/blogs')
  @response(200, {
    description: 'Array of Blog model instances including author details',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Blog, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Blog) filter?: Filter<Blog>,
  ): Promise<Blog[]> {
    return this.blogRepository.find({
      ...filter,
      include: [
        {
          relation: 'author',
          scope: {
            fields: {id: true, name: true, email: true, mobile: true, bio: true, avatar: true, },
          },
        },
      ], // ✅ Include author details
    });
  }


  @patch('/blogs')
  @response(200, {
    description: 'Blog PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Blog, {partial: true}),
        },
      },
    })
    blog: Blog,
    @param.where(Blog) where?: Where<Blog>,
  ): Promise<Count> {
    return this.blogRepository.updateAll(blog, where);
  }

  @get('/blogs/{id}')
  @response(200, {
    description: 'Blog model instance including author details',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Blog, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: number,
    @param.filter(Blog, {exclude: 'where'}) filter?: FilterExcludingWhere<Blog>
  ): Promise<Blog> {
    return this.blogRepository.findById(id, {
      ...filter,
      include: [
        {
          relation: 'author',
          scope: {
            fields: {id: true, name: true, email: true, mobile: true, bio: true, avatar: true, },
          },
        },
      ], // ✅ Include author details
    });
  }

  @patch('/blogs/{id}')
  @response(204, {
    description: 'Blog PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number, // ✅ Ensure number type
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Blog, {partial: true}),
        },
      },
    })
    blog: Blog,
  ): Promise<void> {
    await this.blogRepository.updateById(id, blog);
  }

  @put('/blogs/{id}')
  @response(204, {
    description: 'Blog PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number, // ✅ Ensure number type
    @requestBody() blog: Blog,
  ): Promise<void> {
    await this.blogRepository.replaceById(id, blog);
  }

  @del('/blogs/{id}')
  @response(204, {
    description: 'Blog DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.blogRepository.deleteById(id);
  }
}
