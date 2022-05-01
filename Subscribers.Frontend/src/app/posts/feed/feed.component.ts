import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../services/models/post';
import { ItemManagementService } from '../../services/item-management.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from '../../services/comment.service';
import { JwtPayload } from '../../services/models/jwt-payload';
import { AuthenticationService } from '../../services/authentication.service';
import { Comment } from '../../services/models/comment';

type FeedItem = {
  isComments: boolean,
  post: Post;
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  public posts: FeedItem[] = [];

  public isLoading: boolean = false;

  public isComments: boolean = false;

  public currentUser: JwtPayload | null;

  constructor(
    private postService: PostService,
    private itemManagementService: ItemManagementService,
    private snackBar: MatSnackBar,
    private commentService: CommentService,
    private authenticationService: AuthenticationService,
  ) {
    this.currentUser = this.authenticationService.currentUserDecoded;
  }

  public ngOnInit(): void {
    this.isLoading = true;
    this.loadPosts(3, 0);
    this.itemManagementService.createPostItem$.subscribe(post => {
      this.posts.unshift(<FeedItem> { post: post, isComments: false });
    });
  }

  private loadPosts(take?: number, skip?: number): void {
    this.postService.getAll(take, skip)
      .subscribe({
        next: posts => {
          this.posts = this.posts.concat(posts.map(x => <FeedItem> { post: x, isComments: false }));
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'При загрузки постов возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }

  public onScroll(): void {
    const skip = this.posts.length;
    const take = 3;
    this.isLoading = true;
    this.loadPosts(take, skip);
  }

  public onComment(feedItem: FeedItem): void {
    feedItem.isComments = !feedItem.isComments;
  }

  public sendComment(post: Post, message: string): void {
    const currentUserId = Number(this.currentUser?.sub);
    const commentCreateData = <Comment> {
      ownerId: currentUserId,
      postId: post.id,
      message: message,
    };

    this.commentService.create(commentCreateData, post.id)
      .subscribe({
        next: comment => {
          post.comments?.push(comment);
          this.snackBar.open(
            'Ваш комментарий отправлен',
            'Close',
            { duration: 3000 },
          );
        },
        error: () => {
          this.snackBar.open(
            'При отправке комментария возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }
}
