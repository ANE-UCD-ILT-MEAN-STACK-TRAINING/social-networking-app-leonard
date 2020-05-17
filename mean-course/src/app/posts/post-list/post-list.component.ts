import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading: boolean;
  userId: string;
  totalPosts = 10;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  private postsSub: Subscription;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;

  constructor(public postsService: PostsService, private authService: AuthService) { }

  // @Input() posts: Post[] = []

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        setTimeout(() => { this.isLoading = false; }, 2000);
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }



  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
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
