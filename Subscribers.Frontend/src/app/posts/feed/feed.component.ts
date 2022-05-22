import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../services/models/post';
import { ItemManagementService } from '../../services/item-management.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from '../../services/comment.service';
import { JwtPayload } from '../../services/models/jwt-payload';
import { AuthenticationService } from '../../services/authentication.service';
import { Comment } from '../../services/models/comment';
import { Like } from '../../services/models/like';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';

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

  public form: FormGroup = new FormGroup({
    message: new FormControl(undefined),
  });

  constructor(
    private postService: PostService,
    private itemManagementService: ItemManagementService,
    private snackBar: MatSnackBar,
    private commentService: CommentService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
  ) {
    this.currentUser = this.authenticationService.currentUserDecoded;
  }

  public ngOnInit(): void {
    this.isLoading = true;
    this.loadPosts(3, 0);
    this.itemManagementService.createPostItem$.subscribe(post => {
      this.posts.unshift(<FeedItem>{ post: post, isComments: false });
    });
  }

  private loadPosts(take?: number, skip?: number): void {
    this.postService.getAll(take, skip)
      .subscribe({
        next: posts => {
          this.posts = this.posts.concat(posts.map(x => <FeedItem>{ post: x, isComments: false }));
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
    const commentCreateData = <Comment>{
      ownerId: currentUserId,
      postId: post.id,
      message: message,
    };

    this.commentService.create(commentCreateData, post.id)
      .subscribe({
        next: comment => {
          post.comments?.push(comment);
          this.form.reset();
          this.snackBar.open(
            'Спасибо за ваш комментарий!',
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

  public isAlreadyLike(post: Post): boolean {
    return !!post.likes?.some(like => like.ownerId === this.currentUser?.sub);
  }

  public onLike(post: Post): void {
    this.postService.like(post.id, Number(this.currentUser?.sub))
      .subscribe({
        next: () => {
          post.likes?.push(<Like>{ postId: post.id, ownerId: this.currentUser?.sub });
        },
      });
  }

  public onDislike(post: Post): void {
    this.postService.dislike(post.id, Number(this.currentUser?.sub))
      .subscribe({
        next: () => {
          const likeIndex = post.likes?.findIndex(like => like.ownerId === this.currentUser?.sub);
          if (likeIndex !== undefined) {
            post.likes?.splice(likeIndex, 1);
          }
        },
      });
  }

  public openDeletePostDialog(feedItem: FeedItem): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20rem',
      data: {
        dialogName: 'Удаление поста',
        message: 'Вы действительно хотите удалить этот пост?',
      },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deletePost(feedItem.post.id);
      }
    });
  }

  private deletePost(postId: number): void {
    this.postService.delete(postId)
      .subscribe({
        next: () => {
          const postIndex = this.posts.findIndex(post => post.post.id === postId);
          this.posts.splice(postIndex, 1);
        },
        error: () => {
          this.snackBar.open(
            'При удалении поста возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }

  public canUserDeletePost(feedItem: FeedItem): boolean {
    return this.authenticationService.isAdmin ||
      feedItem.post.ownerId === this.authenticationService.currentUserDecoded?.sub
  }
}
