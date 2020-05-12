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
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }
  //getPosts(){
  //  return [...this.posts];
  // }
  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>
      ("http://localhost:3000/api/posts/" + id);
  }


  //getPosts() {
  //  this.http
  //    .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
  //    .pipe(
  //      map((postData) => {
  //        return postData.posts.map((post) => {
  //          return {
  //            title: post.title,
  //            content: post.content,
  //            id: post._id,
  //          };
  //        });
  //      })
  //    )
  //    .subscribe((transformedPosts) => {
  //      this.posts = transformedPosts;
  //      this.postsUpdated.next([...this.posts]);
  //    });
  //}
  getPosts() {
    this.http
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
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
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }


  deletePost(postId: string) {
    this.http
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        console.log("deleted");
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  };

  deleteAllPost() {
    this.http
      .delete("http://localhost:3000/api/posts/")
      .subscribe(() => {
        console.log("All post deleted");
        //const updatedPosts = this.posts.filter((post) => post.id !== postId);
        //this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        //alert("All post deleted");
        //this.ngOnInit();
        this.getPosts();
      });
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
        imagePath: image
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          // imagePath: response.imagePath
          imagePath: ""
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

}




