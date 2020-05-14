import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading: boolean;
  totalPosts = 10;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  private postSubscription: Subscription;

  constructor(public postsService: PostsService) { }

  //@Input() posts: Post[] = []

  ngOnInit(): void {
    this.isLoading = true;
    //this.posts = this.postsService.getPosts();  commenting out based on step 9.3.3
    //.subscribe((postsReceived: Post[])=> {   changed on 9.3.3
    this.postsService.getPosts(this.postsPerPage, this.currentPage);  //added need to call this get post message from js server
    this.postSubscription = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        // setTimeout(() => { this.isLoading = false }, 2000);
        this.posts = postData.posts;
      });
  }
  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
  }

  onDeleteAll() {
    this.postsService.deleteAllPost()
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    console.log(pageData);
  }

}
