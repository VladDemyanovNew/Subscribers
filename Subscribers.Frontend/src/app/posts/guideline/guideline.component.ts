import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../services/authentication.service';
import { SubscriptionItem } from '../../services/models/subscription';
import { JwtPayload } from '../../services/models/jwt-payload';


@Component({
  selector: 'app-guideline',
  templateUrl: './guideline.component.html',
  styleUrls: ['./guideline.component.scss']
})
export class GuidelineComponent implements OnInit {

  public recommendations: SubscriptionItem[] = [];

  public currentUser: JwtPayload | null;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
  ) {
    this.currentUser = this.authenticationService.currentUserDecoded;
  }

  ngOnInit(): void {
    this.loadRecommendations();
  }

  private loadRecommendations(): void {
    const currentUserId = Number(this.currentUser?.sub);
    this.userService.getRecommendationsForSubscribe(currentUserId)
      .subscribe({
        next: recommendations => {
          this.recommendations = recommendations.map(recommendation => {
            return <SubscriptionItem>{ subscription: recommendation, isSubscribed: false }
          })
        },
        error: () => {
          this.snackBar.open(
            'При загрузки рекомендаций возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }

  public subscribe(recommendation: SubscriptionItem): void {
    const currentUserId = Number(this.currentUser?.sub);
    this.userService.subscribe(currentUserId, recommendation.subscription.id)
      .subscribe({
        next: () => {
          recommendation.isSubscribed = true;
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

  public unsubscribe(recommendation: SubscriptionItem): void {
    const currentUserId = Number(this.currentUser?.sub);
    this.userService.unsubscribe(currentUserId, recommendation.subscription.id)
      .subscribe({
        next: () => {
          recommendation.isSubscribed = false;
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
