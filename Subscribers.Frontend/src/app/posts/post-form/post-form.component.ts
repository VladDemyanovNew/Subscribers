import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostFormProps } from '../../services/models/post-form-props';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as validationConstants from '../../common/constants';
import { Tokens } from '../../services/models/tokens';
import { ErrorResponse } from '../../services/models/error-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from '../../services/post.service';
import { Post } from '../../services/models/post';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { ItemManagementService } from '../../services/item-management.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  public validationConstants = validationConstants;

  public files: File[] = [];

  public isLoading: boolean = false;

  public formGroup: FormGroup = new FormGroup({
    title: new FormControl(undefined, [
      Validators.required,
      Validators.maxLength(validationConstants.MaxLengthPostTitle),
    ]),
    content: new FormControl(undefined, [
      Validators.maxLength(validationConstants.MaxLengthPostContent),
    ]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogProps: PostFormProps,
    private dialogRef: MatDialogRef<PostFormComponent>,
    private snackBar: MatSnackBar,
    private postService: PostService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private itemManagementService: ItemManagementService,
  ) { }

  ngOnInit(): void {
  }

  public onDialogClose(): void {
    this.dialogRef.close();
  }

  public onSelectFile(event: any): void {
    this.files.push(...event.addedFiles);
  }

  public onRemoveFile(event: any): void {
    this.files.splice(this.files.indexOf(event), 1);
  }

  public onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.isLoading = true;

    this.postService.create(<Post>{
        ownerId: this.authenticationService.currentUserDecoded?.sub,
        ...this.formGroup.value,
      }, this.files[0])
      .subscribe({
        next: (post: Post) => {
          this.isLoading = false;
          this.snackBar.open(
            'Пост успешно создан',
            'Close',
            { duration: 3000 },
          );
          this.itemManagementService.create(post);
          this.dialogRef.close(post);
        },
        error: (error: ErrorResponse) => {
          this.isLoading = false;
          this.snackBar.open(
            'При создании поста возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }
}
