import { IsEmail,IsNotEmpty, Matches, MinLength} from "class-validator";

export class forgotpassword {
  
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
  @MinLength(4)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  newpassword: string;

  confirmnewpassword:string;
}

export class emailforsendotp {
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class verifingotp {
  
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    otp:number;
}

export class authuser {
  
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;

}

export class verifydto {
  
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  otp:number

}