import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../services/models/user';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SubscriptionsComponent } from '../subscriptions/subscriptions.component';

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
    private bottomSheet: MatBottomSheet,
  ) {
  }

  public logout(): void {
    this.authenticationService.logout();
  }

  public openBottomSheet(): void {
    this.bottomSheet.open(SubscriptionsComponent);
  }
}
