import { Component, OnInit } from '@angular/core';
import * as validationConstants from '../common/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { matchValidator } from '../common/validators';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Tokens } from '../services/models/tokens';
import { ErrorResponse } from '../services/models/error-response';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public isLoading: boolean = false;

  public validationConstants = validationConstants;

  public formGroup: FormGroup = new FormGroup({
    email: new FormControl(undefined, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl(undefined, [
      Validators.required,
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

  public onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.isLoading = true;

    this.authenticationService.signin(
        this.formGroup.value.email,
        this.formGroup.value.password,
      )
      .subscribe({
        next: (response: Tokens) => {
          this.isLoading = false;
          this.router?.navigate(['/posts']);
        },
        error: (error: ErrorResponse) => {
          this.isLoading = false;
          this.snackBar.open(
            'При попытке войти возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }
}
