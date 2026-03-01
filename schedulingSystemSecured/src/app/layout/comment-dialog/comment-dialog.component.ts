import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css'] 
})
export class CommentDialogComponent {
  comment: string = "";

  constructor(
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      title: string, 
      message: string, 
      isMandatory: boolean 
    }
  ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}