import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';
import { PostsComponent } from '../posts/posts.component';
import { DialogsComponent } from '../dialogs/dialogs.component';
import { NotFoundComponent } from '../not-found/not-found.component';

const appRoutes: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'posts',
    component: PostsComponent,
  },
  {
    path: 'dialogs',
    component: DialogsComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {
}
