import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Post } from '../../services/models/post';
import { PostFormComponent } from '../post-form/post-form.component';
import { PostFormProps } from '../../services/models/post-form-props';

@Component({
  selector: 'app-posts-controls',
  templateUrl: './posts-controls.component.html',
  styleUrls: ['./posts-controls.component.scss']
})
export class PostsControlsComponent {

  constructor(
    private dialog: MatDialog) {
  }

  public openPostFormDialog(isEditMode: boolean, post?: Post): void {
    this.dialog.open(
      PostFormComponent,
      {
        width: '33.5rem',
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
