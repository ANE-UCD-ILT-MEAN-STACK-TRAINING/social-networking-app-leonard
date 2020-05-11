import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading: boolean;

  private postSubscription: Subscription;

  constructor(public postsService: PostsService) { }

  //@Input() posts: Post[] = []

  ngOnInit(): void {
    this.isLoading = true;
    //this.posts = this.postsService.getPosts();  commenting out based on step 9.3.3
    //.subscribe((postsReceived: Post[])=> {   changed on 9.3.3
    this.postsService.getPosts();  //added need to call this get post message from js server

    this.postSubscription = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        setTimeout(() => { this.isLoading = false }, 2000); // timer
        this.posts = posts;
      });
  }
  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  };

  onDeleteAll() {
    this.postsService.deleteAllPost();
  };
}
