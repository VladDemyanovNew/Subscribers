import { AuthenticationService } from '../../services/authentication.service';
import { TeardownLogic } from 'rxjs';

export function appInitializer(authenticationService: AuthenticationService): () => Promise<TeardownLogic> {
  return () => new Promise(resolve => {
    authenticationService.refreshToken()
      .subscribe().add(resolve);
  });
}
