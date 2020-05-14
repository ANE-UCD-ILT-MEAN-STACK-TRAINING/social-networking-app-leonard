import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }
  //getPosts(){
  //  return [...this.posts];
  // }
  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>
      ("http://localhost:3000/api/posts/" + id);
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
  }


  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }


  //  addPost(title: string, content: string) {
  //    const post: Post = { id: null, title: title, content: content };
  //    this.http
  //      .post<{ message: string; postId: string; }>("http://localhost:3000/api/posts", post)
  //      .subscribe(responseData => {
  //        const id = responseData.postId;
  //        post.id = id;
  //        console.log(responseData.message);
  //        this.posts.push(post);
  //        this.postsUpdated.next([...this.posts]);
  //        this.router.navigate(['/']);
  //      });
  //  }


  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(() => {
        this.router.navigate(["/"]);
      });
  }


  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
  }


  deleteAllPost() {
    return this.http.delete("http://localhost:3000/api/posts/");
  };

  //updatePost(id: string, title: string, content: string, image: File) {
  //  const post: Post = { id: id, title: title, content: content, imagePath: null }; // ********to be updated
  //  this.http.put<{ message: string, postId: string }>('http://localhost:3000/api/posts/' + id, post)
  //    .subscribe(responseData => {
  //      console.log(responseData);
  //      const updatedPosts = [...this.posts];
  //      const oldPostIndex = updatedPosts.findIndex(p => p.id == post.id);
  //      updatedPosts[oldPostIndex] = post;
  //      this.posts = updatedPosts;
  //      this.postsUpdated.next([...this.posts]);
  //      this.router.navigate(['/']);
  //    });
  // }
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe((response) => {
        this.router.navigate(["/"]);
      });
  }


}
