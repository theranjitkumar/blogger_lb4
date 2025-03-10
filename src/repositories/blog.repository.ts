import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Blog, User} from '../models';
import {UserRepository} from './user.repository';

export class BlogRepository extends DefaultCrudRepository<
  Blog,
  typeof Blog.prototype.id
> {
  public readonly author: BelongsToAccessor<User, typeof Blog.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, // ✅ Use a Getter
  ) {
    super(Blog, dataSource);
    this.author = this.createBelongsToAccessorFor('author', userRepositoryGetter); // ✅ Use relation name
    this.registerInclusionResolver('author', this.author.inclusionResolver); // ✅ Register relation resolver
  }
}
