import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../services/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public currentUser: User | undefined;

  constructor(
    public authenticationService: AuthenticationService,
    private router: Router,
  ) {
  }

  public ngOnInit(): void {
    // this.authenticationService.currentUser
    //   .subscribe(currentUser => this.currentUser = currentUser);
  }

  public logout(): void {
    this.authenticationService.logout();
    this.router?.navigate(['/login']);
  }
}
