import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostFormProps } from '../../services/models/post-form-props';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as validationConstants from '../../common/constants';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  public validationConstants = validationConstants;

  public files: File[] = [];

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
}
