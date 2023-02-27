import { Controller, Patch} from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { Member } from 'src/models/Member.interface';
import { authMember, verifydto } from 'src/members/member.dto';
import { emailforsendotp, forgotpassword, verifingotp} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class authController {
    constructor(private readonly Authservice:AuthService){}

    @Post('signin')
    @FormDataRequest()
    async loginMember(@Body() Memberdto:authMember) {
        return this.Authservice.signinMember(Memberdto.email,Memberdto.password);
    }

    @Post('signup')
    @FormDataRequest()
    async regMember(@Body() Memberdto:Member) {
        return this.Authservice.signupMember(Memberdto);
        
    }

    @Post('signup/verify')
    @FormDataRequest()
    async verifyotp(@Body() data:verifydto) {
        return this.Authservice.verify(data);
    }

    @Post('/email')
    @FormDataRequest()
    async emailforforgotpassword(@Body() Memberdto:emailforsendotp) {
        return this.Authservice.findemailandsaveotp(Memberdto);
    }

    @Post('/email/verify')
    @FormDataRequest()
    async verifyotpforforgotpassword(@Body() Memberdto:verifingotp) {
        return this.Authservice.otpverificationforforgotpassword(Memberdto);
    }

    @Post('/email/verify/forgotpassword')
    @FormDataRequest()
    async changepass(@Body() Memberdto:forgotpassword) {
        console.log(Memberdto);
        return this.Authservice.changepassword(Memberdto);
    }
}
