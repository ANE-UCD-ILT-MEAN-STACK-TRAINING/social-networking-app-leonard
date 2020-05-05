import { Component, OnInit , Input } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  constructor() { }
  
  @Input() posts = []
  //posts = [
  //  {title: 'First Post', content: " This is the first post content"},
  //  {title: 'Second Post', content: " This is the Second post content"},
  //  {title: 'Third Post', content: " This is the Third post content"}
  //]

  //posts = []

  ngOnInit(): void {
  }
  

}
