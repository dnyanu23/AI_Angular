
import { HttpInterceptorFn } from '@angular/common/http';

export const APIInterceptor: HttpInterceptorFn = (req, next) => {
  // Example: Add an Authorization header
  console.log('Intercepting request:', req);
  const cloned = req.clone({
    setHeaders: { Authorization: 'Bearer YOUR_TOKEN' }
  });
  return next(cloned);
};