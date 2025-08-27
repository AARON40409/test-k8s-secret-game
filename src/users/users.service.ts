import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UserRepository } from 'src/repository/user-repository';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}

  async createUsers(input: CreateUserDto) {
    if (!input || !input.firstname) {
      throw new Error('Invalid input');
    }
    
    const user = await this.prisma.user.findFirst({
      where: {
        firstname: input.firstname,
      },
    });
  
    if (user) {
      throw new NotFoundException('User already exists');
    }
  
    return this.prisma.user.create({
      data: {
        ...input
      },
    });
  }

  async findById(id: string) {
    const getUser = await this.prisma.user.findUnique({
      where: { id }});
      console.log('getUser:',getUser);
      
      if (!getUser) {
        throw new NotFoundException('Donnée introuvable');
      }

    return getUser
  }

  async getAllUser() {
    const getAll = await this.prisma.user.findMany();
      console.log('getUser:',getAll);
      
      if (!getAll) {
        throw new NotFoundException('Donnée introuvable');
      }

    return getAll
  }
  
  





}
