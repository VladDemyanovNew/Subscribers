import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './routing/app-routing.module';
import { PostsComponent } from './posts/posts.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { DialogsComponent } from './dialogs/dialogs.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { PostsControlsComponent } from './posts/posts-controls/posts-controls.component';
import { FeedComponent } from './posts/feed/feed.component';
import { GuidelineComponent } from './posts/guideline/guideline.component';
import { PostService } from './services/post.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostFormComponent } from './posts/post-form/post-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthenticationService } from './services/authentication.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtInterceptor } from './common/interceptors/jwt.interceptor';
import { ItemManagementService } from './services/item-management.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { MatListModule } from '@angular/material/list';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatBadgeModule } from '@angular/material/badge';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { WebsocketService } from './services/websocket.service';
import { ChatService } from './services/chat.service';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PostsComponent,
    SigninComponent,
    SignupComponent,
    DialogsComponent,
    PostsControlsComponent,
    FeedComponent,
    GuidelineComponent,
    PostFormComponent,
    SubscriptionsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    InfiniteScrollModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatBadgeModule,
    ScrollingModule,
    SocketIoModule.forRoot({
      url: environment.wsBaseUrl,
    }),
  ],
  providers: [
    PostService,
    AuthenticationService,
    ItemManagementService,
    MatBottomSheet,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    WebsocketService,
    ChatService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
