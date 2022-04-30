import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { matchValidator } from '../common/validators';
import * as validationConstants from '../common/constants';
import { AuthenticationService } from '../services/authentication.service';
import { ErrorResponse } from '../services/models/error-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Tokens } from '../services/models/tokens';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public files: File[] = [];

  public isLoading: boolean = false;

  public validationConstants = validationConstants;

  public formGroup: FormGroup = new FormGroup({
    email: new FormControl(undefined, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl(undefined, [
      Validators.required,
      matchValidator('confirmationPassword', true),
      Validators.maxLength(validationConstants.MaxLengthUserPassword),
      Validators.minLength(validationConstants.MinLengthUserPassword),
    ]),
    confirmationPassword: new FormControl(undefined, [
      Validators.required,
      matchValidator('password'),
      Validators.maxLength(validationConstants.MaxLengthUserPassword),
      Validators.minLength(validationConstants.MinLengthUserPassword),
    ]),
    nickname: new FormControl(undefined, [
      Validators.maxLength(validationConstants.MaxLengthUserNickname),
    ]),
  });

  constructor(
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
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

    this.authenticationService.signup({
        ...this.formGroup.value,
      }, this.files[0])
      .subscribe({
        next: (response: Tokens) => {
          this.isLoading = false;
          this.authenticationService.currentUserValue = response;
          this.router?.navigate(['/posts']);
        },
        error: (error: ErrorResponse) => {
          this.isLoading = false;
          this.snackBar.open(
            'При регистрации возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }
}
