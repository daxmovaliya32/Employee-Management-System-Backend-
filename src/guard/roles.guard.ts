import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { JwtService } from '@nestjs/jwt';

// guard for admin
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

// guard for user
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
        const user = this.jwtService.verify(token); 
        if(user.subscribe==false)
        {
            throw new UnauthorizedException('you are not right person to do this');
        }
        if(user.role == "User")
        {
          request.user=user
            return true;
        }else{
          throw new UnauthorizedException('you are not right person to do this');
        }
  }
}

@Injectable()
export class RolesGuardorguser implements CanActivate {
  constructor(private readonly jwtService:JwtService) {}

  canActivate(context: ExecutionContext):boolean{ 
    try{
    const request = context.switchToHttp().getRequest();
    const token = request.headers.token;
        if(!token)
        {
            throw new UnauthorizedException('token is not provided');
        }
   
        const orguser = this.jwtService.verify(token); 
        if(orguser.role == "orguser")
        {
          request.orguser=orguser
            return true;
        }else{
          throw new UnauthorizedException('you are not right person to do this');
        }
    } catch (error) {
      console.log(error); 
    }
  }
}

// guard for teammanager
export class RolesGuardTeamManager implements CanActivate {
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
        if(user.role=="Team_Manager")
        {
          return true;
        }else{
          throw new UnauthorizedException('only Team_Manager can perform this action');
        }
    } catch (error) {
        throw new UnauthorizedException(error.response);  
    }
  }
}

// guard for project manager
export class RolesGuardProjectManager implements CanActivate {
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
        if(user.role=="Project_Manager")
        {
          return true;
        }else{
          throw new UnauthorizedException('only Project_Manager can perform this action');
        }
    } catch (error) {
        throw new UnauthorizedException(error.response);  
    }
  }
}

// guard for taskmanager
export class RolesGuardTaskManager implements CanActivate {
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
        if(user.role=="Task_Manager")
        {
          return true;
        }else{
          throw new UnauthorizedException('only Task_Manager can perform this action');
        }
    } catch (error) {
        throw new UnauthorizedException(error.response);  
    }
  }
}

// guard for department manager
export class RolesGuardDepartmentManager implements CanActivate {
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
        if(user.role=="Department_Manager")
        {
          return true;
        }else{
          throw new UnauthorizedException('only Department_Manager can perform this action');
        }
    } catch (error) {
        throw new UnauthorizedException(error.response);  
    }
  }
}


