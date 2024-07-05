import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import prisma from 'prisma/prisma';
import CustomHttpError from 'types/error';
import { ILogin } from 'types/loginTypes';
import { checkPassword } from 'util/bcrypt';

@Injectable()
export class AppService {
  constructor(private jwtService : JwtService) {}


  getHello(): string {
    return 'Hello World!';
  }

  async getSignIn({password, username} : ILogin) {
    try {
      const users = await prisma.user.findFirst({
        where : {
          username 
        }
      })

      if(users == null) {
        throw new CustomHttpError("User/Password Salah", HttpStatus.NOT_FOUND)
      }
      
      const isValid = checkPassword(password, users.password)
      
      if(!isValid) {
        throw new CustomHttpError("User/Password Salah", HttpStatus.NOT_FOUND)
      }

      const {password : passwordThrow, ...newUser} = users
      
      return {
        username : users.username,
        role : users.role,
        id : users.id,
        access_token : await this.jwtService.signAsync(newUser)  
      }

      


    }catch(err) {
      if(err instanceof CustomHttpError) {
        throw new HttpException(err.message, err.status)
      }
    }
  }



}
