// import { OneToMany } from 'typeorm';
import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Option } from './option.entity';
import { Post } from './post.entity';
import { Media } from '../../media/entities/media.entity';

@Entity({ name: 'options_groups', schema: POSTS_SCHEMA })
export class OptiosnGroup extends Model {
  @Column()
  name: string;

  // one to many relation with option entity
  @OneToMany(() => Option, (option) => option.optionsGroup)
  options: Option[];

  // many to one relation with post entity
  @ManyToOne(() => Post, (post) => post.groups, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  post: Post;

  // one to many relation with media entity
  @OneToMany(() => Media, (media) => media.optionsGroup)
  media: Media[];
}
