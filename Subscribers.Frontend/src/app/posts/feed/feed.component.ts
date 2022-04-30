import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../services/models/post';
import { ItemManagementService } from '../../services/item-management.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  public posts: Post[] = [];

  constructor(
    private postService: PostService,
    private itemManagementService: ItemManagementService) { }

  ngOnInit(): void {
    this.loadPosts();
    this.itemManagementService.createItem$.subscribe(post => {
      this.posts.unshift(post);
    });
  }

  private loadPosts(): void {
    this.postService.getAll()
      .subscribe({
        next: posts => {
          this.posts = posts.reverse();
        },
        error: () => {
          console.log('error loadPosts');
        },
      });
  }

}
