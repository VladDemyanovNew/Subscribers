import { KeyValue } from '@angular/common';

export const MaxLengthPostContent = 4000;

export const MaxLengthPostTitle = 32;

export const MaxLengthUserPassword = 32;

export const MinLengthUserPassword = 5;

export const MaxLengthUserNickname = 32;

export const CurrentUser = 'currentUser';

export const RefreshTokenHeader: KeyValue<string, string> = { key: 'RefreshToken', value: 'Active' };
