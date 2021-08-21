import Model, { POSTS_SCHEMA } from '../../shared/entity.model';
import { Column, Entity, OneToMany } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Vote } from '../../votes/entities/vote.entity';
import { Feedback } from 'src/report/entities/feedback.entity';

@Entity({ name: 'users', schema: POSTS_SCHEMA })
export class User extends Model {
  @Column()
  name: string;

  @Column()
  profile_pic: string;

  @Column({ default: '0' })
  google_id: string;

  // one to many relation with posts entity
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  // one to many relation with votes entity
  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];
}
