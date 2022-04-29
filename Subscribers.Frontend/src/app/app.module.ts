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
import { PostsControlsComponent } from './posts/posts-controls/posts-controls.component';
import { FeedComponent } from './posts/feed/feed.component';
import { GuidelineComponent } from './posts/guideline/guideline.component';
import { PostService } from './services/post.service';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostFormComponent } from './posts/post-form/post-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PostsComponent,
    SigninComponent,
    SignupComponent,
    DialogsComponent,
    NotFoundComponent,
    PostsControlsComponent,
    FeedComponent,
    GuidelineComponent,
    PostFormComponent,
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
    MatDialogModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
