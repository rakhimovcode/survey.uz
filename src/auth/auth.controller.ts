import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  Get,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInAdminDto } from "./dto/sign-in-admin.dto";
import { Request, Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInAdminDto, @Res({passthrough:true}) res: Response) {
    return this.authService.signInAdmin(signInDto, res);
  }

  @Post("sign-out")
  @HttpCode(200)
  async signOut(@Req() req: Request, @Res({passthrough:true}) res: Response) {
    return this.authService.signOutAdmin(req, res);
  }

  @Get("refresh")
  @HttpCode(200)
  async refreshToken(@Req() req: Request, @Res({passthrough:true}) res: Response) {
    return this.authService.refresh_token_Admin(req, res);
  }
}
