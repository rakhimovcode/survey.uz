import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from '../admins/admins.service';
import { Admin } from '../admins/models/admin.model';
import { SignInAdminDto } from './dto/sign-in-admin.dto';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private readonly jwtService:JwtService,
    private readonly adminService:AdminsService){}

    async generateTokenforAdmin(admin:Admin ) {
    const payload = {
      id: admin.id,
      is_creator:admin.is_creator,
      email:admin.email
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async signInAdmin(signInDto:SignInAdminDto, res: Response) {
    const Admin = await this.adminService.findByEmail(signInDto.email);
    if (!Admin) {
      throw new BadRequestException("Bunday Admin mavjud emas!");
    }
    const isValid = await bcrypt.compare(signInDto.password, Admin.password);
    if (!isValid) {
      throw new BadRequestException("Email yoki Password Noto'g'ri");
    }
    const { accessToken, refreshToken } =
      await this.generateTokenforAdmin(Admin);
    res.cookie("refresh_token", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });
    const hashed_refresh_token = await bcrypt.hash(refreshToken, 7);
    Admin.refresh_token = hashed_refresh_token;
    await Admin.save();
    return { message: "Tizimga xush kelibsiz", accessToken };
  }

  async signOutAdmin(req: Request, res: Response) {
    const refresh_token = req.cookies["refresh_token"];
    if (!refresh_token)
      throw new BadRequestException("Refresh Token mavjud emas!");
    const Admin = await this.adminService.findbyToken(refresh_token);
    if (!Admin) throw new BadRequestException("Token Topilmadi");

    Admin.refresh_token = "";
    await Admin.save();

    res.clearCookie("refresh_token");

    return res.status(200).json({
      success: true,
      message: "Admin  logged out successfully",
    });
  }

  async refresh_token_Admin(req: Request, res: Response) {
    const refresh_token = req.cookies["refresh_token"];
    if (!refresh_token)
      throw new BadRequestException("Refresh Token mavjud emas!");

    const payload = await this.jwtService.verify(refresh_token, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    const user = await this.adminService.findOne(payload.id);
    if (!user || !user.refresh_token) {
      throw new UnauthorizedException("Admin topilmadi yoki login qilinmagan");
    }
    const isValid = await bcrypt.compare(refresh_token, user.refresh_token);
    if (!isValid) throw new UnauthorizedException("Refresh Token noto'g'ri");

    const { accessToken, refreshToken } =
      await this.generateTokenforAdmin(user);
    const hashed_refresh_token = await bcrypt.hash(refreshToken, 7);
    user.refresh_token = hashed_refresh_token;
    await user.save();

    res.cookie("refresh_token", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      token: accessToken,
    });
  }


    
}
