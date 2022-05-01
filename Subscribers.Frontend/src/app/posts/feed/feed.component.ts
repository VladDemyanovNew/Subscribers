import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../services/models/post';
import { ItemManagementService } from '../../services/item-management.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  public posts: Post[] = [];

  public isLoading: boolean = false;

  constructor(
    private postService: PostService,
    private itemManagementService: ItemManagementService,
    private snackBar: MatSnackBar,
  ) {
  }

  public ngOnInit(): void {
    this.isLoading = true;
    this.loadPosts(3, 0);
    this.itemManagementService.createPostItem$.subscribe(post => {
      this.posts.unshift(post);
    });
  }

  private loadPosts(take?: number, skip?: number): void {
    this.postService.getAll(take, skip)
      .subscribe({
        next: posts => {
          this.posts = this.posts.concat(posts);
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
}
