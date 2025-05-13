import { catchError, of } from 'rxjs';
import { AccountService } from '@app/_services';

export function appInitializer(accountService: AccountService) {
    return () => Promise.resolve(); // No se necesita inicialización relacionada con tokens
}