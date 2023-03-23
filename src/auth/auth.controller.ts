import { Controller, Patch} from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { User } from 'src/models/user.interface';
import { authuser, verifydto } from 'src/auth/auth.dto';
import { emailforsendotp, forgotpassword, verifingotp} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class authController {
    constructor(private readonly Authservice:AuthService){}

    @Post('signin')
    @FormDataRequest()
    async loginuser(@Body() userdto:authuser) {
        return this.Authservice.signinuser(userdto.email,userdto.password);
    }

    @Post('signup')
    @FormDataRequest()
    async reguser(@Body() userdto:User) {
        return this.Authservice.signupuser(userdto);
        
    }

    @Post('signup/verify')
    @FormDataRequest()
    async verifyotp(@Body() data:verifydto) {
        return this.Authservice.verify(data);
    }

    @Post('/email')
    @FormDataRequest()
    async emailforforgotpassword(@Body() userdto:emailforsendotp) {
        return this.Authservice.findemailandsaveotp(userdto);
    }

    @Post('/email/verify')
    @FormDataRequest()
    async verifyotpforforgotpassword(@Body() userdto:verifingotp) {
        return this.Authservice.otpverificationforforgotpassword(userdto);
    }

    @Post('/email/verify/forgotpassword')
    @FormDataRequest()
    async changepass(@Body() userdto:forgotpassword) {
        console.log(userdto);
        return this.Authservice.changepassword(userdto);
    }
}
