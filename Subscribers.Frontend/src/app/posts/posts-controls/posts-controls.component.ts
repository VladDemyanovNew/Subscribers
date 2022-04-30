import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Post } from '../../services/models/post';
import { PostFormComponent } from '../post-form/post-form.component';
import { PostFormProps } from '../../services/models/post-form-props';

@Component({
  selector: 'app-posts-controls',
  templateUrl: './posts-controls.component.html',
  styleUrls: ['./posts-controls.component.scss']
})
export class PostsControlsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public openPostFormDialog(isEditMode: boolean, post?: Post): void {
    const dialogRef = this.dialog.open(
      PostFormComponent,
      {
        width: '37.5rem',
        data: <PostFormProps>{
          post: post,
          dialogTitle: isEditMode ? 'Редактирование поста' : 'Создание нового поста',
          isEditMode: isEditMode,
          panelClass: 'custom-modalbox',
        },
      },
    );
  }
}
