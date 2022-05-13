import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '../services/models/user';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { WebsocketService } from '../services/websocket.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { JwtPayload } from '../services/models/jwt-payload';
import { ChatService } from '../services/chat.service';
import { Chat } from '../services/models/chat';
import { ItemManagementService } from '../services/item-management.service';
import { SubscriptionItem } from '../services/models/subscription';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.scss']
})
export class DialogsComponent implements OnInit, OnDestroy {

  public chats: Chat[] = [];

  public foundUsers: SubscriptionItem[] = [];

  public selectedChat?: Chat;

  private scrollSectionViewChild: CdkVirtualScrollViewport | undefined;

  public currentUser: JwtPayload | null;

  public isSearch: boolean = false;

  public emptySearchResult: boolean = false;

  public messageFormGroup: FormGroup = new FormGroup({
    message: new FormControl(undefined),
  });

  public searchFormGroup: FormGroup = new FormGroup({
    search: new FormControl(undefined),
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
    private snackBar: MatSnackBar,
    private websocketService: WebsocketService,
    private authenticationService: AuthenticationService,
    private chatService: ChatService,
    private itemManagementService: ItemManagementService,
    private userService: UserService,
  ) {
    this.currentUser = this.authenticationService.currentUserDecoded;
  }

  public ngOnInit(): void {
    this.loadChats();

    this.subscriptions = [
      this.itemManagementService.createChatItem$.subscribe(chat => {
        this.chats.push(chat);
        this.onSelectChat(chat);
      }),
      this.websocketService.sendPrivateMessageToClient$.subscribe(message => {
        this.selectedChat?.messages.push(message);
        setTimeout(() => this.scrollSectionViewChild?.scrollTo({ bottom: 0, behavior: 'auto' }));
      }),
    ];
  }

  public ngOnDestroy(): void {
    if (!this.selectedChat) {
      return;
    }
    this.websocketService.leaveRoom(1);
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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

  public onSelectChat(selection: Chat): void {
    if (!this.currentUser) {
      return;
    }
    if (this.selectedChat) {
      this.websocketService.leaveRoom(this.selectedChat.id);
    }

    this.selectedChat = selection;
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
    this.messageFormGroup.reset();
    this.messageFormGroup.markAsPristine();
    this.messageFormGroup.markAsUntouched();
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

  public openSearch(): void {
    this.isSearch = true;
  }

  public closeSearch(): void {
    this.isSearch = false;
    this.foundUsers = [];
    this.searchFormGroup.reset();
    this.emptySearchResult = false;
  }

  public searchUser(): void {
    this.userService.getAll(this.searchFormGroup.value.search)
      .subscribe({
        next: users => {
          this.foundUsers = users.map(user => <SubscriptionItem> { subscription: user, isSubscribed: false });
          if (users.length === 0) {
            this.emptySearchResult = true;
          } else {
            this.emptySearchResult = false;
          }
        },
        error: () => {
          this.snackBar.open(
            'При поиске пользователей возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }

  public subscribe(user: SubscriptionItem): void {
    const currentUserId = Number(this.currentUser?.sub);
    this.userService.subscribe(currentUserId, user.subscription.id)
      .subscribe({
        next: () => {
          user.isSubscribed = true;
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

  public unsubscribe(user: SubscriptionItem): void {
    const currentUserId = Number(this.currentUser?.sub);
    this.userService.unsubscribe(currentUserId, user.subscription.id)
      .subscribe({
        next: () => {
          user.isSubscribed = false;
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

  public createChat(user: User): void {
    const chatCreateData = <Chat> {
      users: [
        <User> {
          id: this.currentUser?.sub,
        },
      ],
    };
    if (user.id !== this.currentUser?.sub) {
      chatCreateData.users.push(user);
    }

    this.chatService.create(chatCreateData)
      .subscribe({
        next: (chat) => {
          this.chats.push(chat);
          this.closeSearch();
        },
        error: () => {
          this.snackBar.open(
            'При создании чата возникла ошибка',
            'Close',
            { duration: 3000 },
          );
        },
      });
  }
}
