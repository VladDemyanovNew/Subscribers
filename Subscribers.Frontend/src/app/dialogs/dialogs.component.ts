import { Component, OnInit } from '@angular/core';
import { User } from '../services/models/user';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.scss']
})
export class DialogsComponent implements OnInit {

  public users: User[] = [];

  public selectedUser?: User;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  private loadSubscriptions(): void {
    this.userService.getAll()
      .subscribe({
        next: users => {
          this.users = users;
        },
        error: () => {
          this.snackBar.open(
            'При загрузки пользователей возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }

  public onSelectUser(selection: MatSelectionListChange): void {
    this.selectedUser = selection.options[0].value;
  }
}
