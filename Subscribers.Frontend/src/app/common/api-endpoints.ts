import { environment } from '../../environments/environment';

export class ApiEndpoints {

  public static Posts = `${ environment.apiBaseUrl }/posts`;

  public static Auth = `${ environment.apiBaseUrl }/auth`;

  public static Users = `${ environment.apiBaseUrl }/users`;

  public static Chats = `${ environment.apiBaseUrl }/chats`;
}
