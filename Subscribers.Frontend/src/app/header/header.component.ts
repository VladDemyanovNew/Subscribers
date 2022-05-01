import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../services/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public currentUser: User | undefined;

  constructor(
    public authenticationService: AuthenticationService,
    private router: Router,
  ) {
  }

  public logout(): void {
    this.authenticationService.logout();
    this.router?.navigate(['/signin']);
  }
}
