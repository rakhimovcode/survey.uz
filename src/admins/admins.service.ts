import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin) private readonly adminModel:typeof Admin,
private readonly jwtService:JwtService){}
  async create(createAdminDto: CreateAdminDto) {
    const {password,...otherDto} =  createAdminDto
    const hashed_password = await bcrypt.hash(password,7)
    const newAdmin = await this.adminModel.create({password:hashed_password,...otherDto})
    return {message:"New Admin Created Successfully!"}
  }

  findAll() {
    return this.adminModel.findAll({include:{all:true}})
  }

  findOne(id: number) {
    return this.adminModel.findByPk(id)
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const data = await this.adminModel.update(updateAdminDto,{where:{id},returning:true})
    return data[1][0]
  }

  remove(id: number) {
    return this.adminModel.destroy({where:{id}})
  }
  findByEmail(email:string){
    return this.adminModel.findOne({where:{email}})
  }
  async findbyToken(refresh_token: string): Promise<Admin | null> {
    if (!refresh_token) {
      throw new BadRequestException("Refresh Token berilmagan!");
    }
    try {
      const decoded = (await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      })) as { id: number };
      const patient = await this.adminModel.findOne({
        where: { id: decoded.id },
      });
      return patient;
    } catch (error) {
      throw new BadRequestException("Invalid or expired refresh token!");
    }
  }
}
