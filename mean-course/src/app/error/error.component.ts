import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ErrorComponent>, @Inject(MAT_DIALOG_DATA) public data: { message: string }) { }
  ngOnInit(): void {
  }

  // this will Close the Error Dialog
  close() {
    this.dialogRef.close();
  }

}

