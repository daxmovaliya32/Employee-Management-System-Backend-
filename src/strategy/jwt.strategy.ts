import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from "passport-local"
import {ExtractJwt} from "passport-jwt"

@Injectable()
export class jwtstrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest:ExtractJwt,
            secretOrKey:process.env.jwtsecret
        })
    }
}