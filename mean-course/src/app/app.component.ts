import { Component } from '@angular/core';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mean-course';
  //storedPosts = []  modified in step 2.10.3.1;
  storedPosts : Post[] = [];
  onPostAdded(post){
    this.storedPosts.push(post);
  }

}
