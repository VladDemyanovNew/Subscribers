import { environment } from '../../environments/environment';

export class ApiEndpoints {

  public static Posts = `${ environment.apiBaseUrl }/posts`;
}
