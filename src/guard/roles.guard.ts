import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class RolesGuardadmin implements CanActivate {
  constructor(private readonly jwtService:JwtService) {}

  canActivate(context: ExecutionContext):boolean{
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.token;
      if(!token)
      {
          throw new UnauthorizedException('token is not provided');
      } 
        const user = this.jwtService.verify(token)
        request.user=user
        console.log(user.role);
        if(user.role=="Admin")
        {
          return true;
        }else{
          throw new UnauthorizedException('only admin can perform this action');
        }
    } catch (error) {
        throw new UnauthorizedException(error.response);  
    }
  }
}

@Injectable()
export class RolesGuarduser implements CanActivate {
  constructor(private readonly jwtService:JwtService) {}

  canActivate(context: ExecutionContext):boolean{ 
    const request = context.switchToHttp().getRequest();
    const token = request.headers.token;
        if(!token)
        {
            throw new UnauthorizedException('token is not provided');
        }
    try {
        const user = this.jwtService.verify(token) 
        if(user.role == "User")
        {
          request.user=user
            return true;
        }else{
          throw new UnauthorizedException('you are not right person to do this');
        }
    } catch (error) {
      console.log(error); 
    }
  }
}

// @Injectable()
// export class RolesGuardforadminanduser implements CanActivate {
//   constructor(private readonly jwtService:JwtService) {}

//   canActivate(context: ExecutionContext):boolean{ 
//     const request = context.switchToHttp().getRequest();
//     const token = request.headers.token;
//         if(!token)
//         {
//             throw new UnauthorizedException('token is not provided');
//         }
//     try {
//         const user = this.jwtService.verify(token) 
//         if(user.role =="User" || user.role =="Admin")
//         {
//           request.user=user
//             return true;
//         }
//     } catch (error) {
//         throw new UnauthorizedException(error.response);  
//     }
//   }
// }