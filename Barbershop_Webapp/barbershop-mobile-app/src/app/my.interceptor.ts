import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';


export const myInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken();

  const cloneReq = req.clone({
    withCredentials: true,
  })

  return next(cloneReq);
};
