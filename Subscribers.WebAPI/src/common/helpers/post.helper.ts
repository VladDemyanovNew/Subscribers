import { Post } from '../models/posts.model';
import { PostDto } from '../dtos/post.dto';

export function fillPost(source: Post, dest: Post): void {
  dest.ownerId = source.ownerId;
  dest.content = source.content;
  dest.imagePath = source.imagePath;
  dest.title = source.title;
}

export function parsePostToDto(post: Post): PostDto {
  return <PostDto> {
    id: post.id,
    content: post.content,
    title: post.title,
    ownerId: post.ownerId,
    imagePath: post.imagePath,
  };
}