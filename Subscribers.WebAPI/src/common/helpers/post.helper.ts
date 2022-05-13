import { Post } from '../models/posts.model';
import { PostDto } from '../dtos/post.dto';
import { parseUserToDto } from './user.helper';

export function fillPost(source: Post, dest: Post): void {
  dest.ownerId = source.ownerId;
  dest.content = source.content;
  dest.imagePath = source.imagePath;
  dest.title = source.title;
}

export function parsePostToDto(post: Post): PostDto {
  return <PostDto> {
    id: post.id,
    ownerId: post.ownerId,
    content: post.content,
    imagePath: post.imagePath,
    title: post.title,
    owner: parseUserToDto(post.owner),
    comments: post.comments,
    likes: post.likes,
  };
}