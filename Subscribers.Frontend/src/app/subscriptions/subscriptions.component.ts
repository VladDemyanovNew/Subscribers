import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../services/authentication.service';
import { SubscriptionItem } from '../services/models/subscription';
import { JwtPayload } from '../services/models/jwt-payload';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  public subscriptions: SubscriptionItem[] = [];

  public currentUser: JwtPayload | null;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
  ) {
    this.currentUser = this.authenticationService.currentUserDecoded;
  }

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  private loadSubscriptions(): void {
    const currentUserId = Number(this.currentUser?.sub);
    this.userService.getUserSubscriptions(currentUserId)
      .subscribe({
        next: recommendations => {
          this.subscriptions = recommendations.map(recommendation => {
            return <SubscriptionItem> { subscription: recommendation, isSubscribed: true }
          })
        },
        error: () => {
          this.snackBar.open(
            'При загрузки подписок возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }

  public subscribe(subscription: SubscriptionItem): void {
    const currentUserId = Number(this.currentUser?.sub);
    this.userService.subscribe(currentUserId, subscription.subscription.id)
      .subscribe({
        next: () => {
          subscription.isSubscribed = true;
          this.snackBar.open(
            'Подписка оформлена',
            'Close',
            { duration: 3000 },
          );
        },
        error: () => {
          this.snackBar.open(
            'При оформлении подписки возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }

  public unsubscribe(subscription: SubscriptionItem): void {
    const currentUserId = Number(this.currentUser?.sub);
    this.userService.unsubscribe(currentUserId, subscription.subscription.id)
      .subscribe({
        next: () => {
          subscription.isSubscribed = false;
          this.snackBar.open(
            'Подписка удалена',
            'Close',
            { duration: 3000 },
          );
        },
        error: () => {
          this.snackBar.open(
            'При удалении подписки возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }
}
