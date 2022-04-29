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
import { NotFoundComponent } from './not-found/not-found.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { PostConstructorComponent } from './posts/post-constructor/post-constructor.component';
import { FeedComponent } from './posts/feed/feed.component';
import { GuidelineComponent } from './posts/guideline/guideline.component';
import { PostService } from './services/post.service';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PostsComponent,
    SigninComponent,
    SignupComponent,
    DialogsComponent,
    NotFoundComponent,
    PostConstructorComponent,
    FeedComponent,
    GuidelineComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
