import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, AfterViewInit {
  //constructor( public postsService : PostsService ) { }

  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading: boolean;

  public focusSetting = new EventEmitter<boolean>();

  constructor(public postsService: PostsService,
    public route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          //setTimeout(() => { this.isLoading = false }, 1000); // timer
          this.isLoading = false;
          this.post = { id: postData._id, title: postData.title, content: postData.content }
        });
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    });

  }

  ngAfterViewInit() { // ngOnInit is NOT the right lifecycle event for this.
    this.focusSetting.emit(true);
  }

  onSavePost(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    }
    else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    form.resetForm(); // is this being called?
  }

}

