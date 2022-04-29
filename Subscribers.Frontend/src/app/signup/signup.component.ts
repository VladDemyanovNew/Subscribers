import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public files: File[] = [];

  public formGroup: FormGroup = new FormGroup({

  });

  constructor() { }

  ngOnInit(): void {
  }

  public onSelectFile(event: any): void {
    this.files.push(...event.addedFiles);
  }

  public onRemoveFile(event: any): void {
    this.files.splice(this.files.indexOf(event), 1);
  }

}
