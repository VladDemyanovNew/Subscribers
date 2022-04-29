import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../services/models/post';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  public posts: Post[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  private loadPosts(): void {
    this.postService.getAll()
      .subscribe({
        next: posts => {
          this.posts = posts;
        },
        error: () => {
          console.log('error loadPosts');
        },
      });
  }

}
