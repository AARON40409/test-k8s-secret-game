import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger();
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      this.logger.verbose(
        `Before... ${context.getHandler().name} of ${context.getClass().name}`,
      );
  
      return next
        .handle()
        .pipe(
          tap(() =>
            this.logger.verbose(
              `After... ${context.getHandler().name} of ${
                context.getClass().name
              }`,
            ),
          ),
        );
    }
  }
  