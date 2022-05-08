import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '../services/models/user';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectionListChange } from '@angular/material/list';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { WebsocketService } from '../services/websocket.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { JwtPayload } from '../services/models/jwt-payload';
import { ChatService } from '../services/chat.service';
import { Chat } from '../services/models/chat';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.scss']
})
export class DialogsComponent implements OnInit, OnDestroy {

  public users: User[] = [];

  public chats: Chat[] = [];

  public selectedChat?: Chat;

  private scrollSectionViewChild: CdkVirtualScrollViewport | undefined;

  public currentUser: JwtPayload | null;

  public formGroup: FormGroup = new FormGroup({
    message: new FormControl(undefined),
  });

  private subscriptions: Subscription[] = [];

  @ViewChild('scrollSection', { static: false })
  public set scrollSection(element: CdkVirtualScrollViewport) {
    if (!element) {
      return;
    }
    setTimeout(() => {
      element.scrollTo({ bottom: 0, behavior: 'auto' });
    });
    this.scrollSectionViewChild = element;
  }

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private websocketService: WebsocketService,
    private authenticationService: AuthenticationService,
    private chatService: ChatService,
  ) {
    this.currentUser = this.authenticationService.currentUserDecoded;
  }

  public ngOnInit(): void {
    this.loadSubscriptions();
    this.loadChats();

    const wsSubscription = this.websocketService.sendPrivateMessageToClient$
      .subscribe(message => {
        this.selectedChat?.messages.push(message);
        setTimeout(() => this.scrollSectionViewChild?.scrollTo({ bottom: 0, behavior: 'auto' }));
      });
    this.subscriptions.push(wsSubscription);
  }

  public ngOnDestroy(): void {
    if (!this.selectedChat) {
      return;
    }
    this.websocketService.leaveRoom(1);
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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

  private loadChats(): void {
    if (!this.currentUser) {
      return;
    }

    this.chatService.getUserChats(this.currentUser?.sub)
      .subscribe({
        next: chats => {
          this.chats = chats;
        },
        error: () => {
          this.snackBar.open(
            'При загрузки диалогов возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }

  public onSelectUser(selection: MatSelectionListChange): void {
    if (!this.currentUser) {
      return;
    }

    if (this.selectedChat) {
      this.websocketService.leaveRoom(this.selectedChat.id);
    }

    this.selectedChat = selection.options[0].value;
    this.scrollSectionViewChild?.scrollTo({ bottom: 0, behavior: 'auto' })

    if (!this.selectedChat) {
      return;
    }
    this.websocketService.joinRoom(this.selectedChat.id);
  }

  public onMessageSend(message: string): void {
    if (!this.selectedChat || !this.currentUser) {
      return;
    }
    this.websocketService.sendPrivateMessage({
      chatId: this.selectedChat.id,
      senderId: this.currentUser.sub,
      content: message,
    });
    this.formGroup.reset();
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
  }

  public getCompanion(users: User[]): User | undefined {
    const user = users.find(user => user.id !== this.currentUser?.sub);
    if (!user && users.length > 0) {
      return users[0];
    }

    return user;
  }

  public getMessageStyle(senderId?: number) {
    return senderId === this.currentUser?.sub ? 'message-right' : null
  }
}
