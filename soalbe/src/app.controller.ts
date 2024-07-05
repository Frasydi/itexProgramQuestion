import { Controller, Delete, Get, HttpException, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ZLogin } from 'types/loginTypes';
import { Response, response, } from 'express';
import { AuthGuard } from './app.guard';
import { User } from 'types/customRequest';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/login")
  async login(@Request() request: Request, @Res({passthrough : true}) response : Response) {
    const validation = ZLogin.safeParse(request.body)
    if (validation.success == false) {
      throw new HttpException("Invalid Body", HttpStatus.BAD_REQUEST)
    }
    const result = await this.appService.getSignIn(validation.data)

    if(result == null) {
      throw new HttpException("Ada Masalah", HttpStatus.BAD_REQUEST)
    }

    response.cookie("token", result.access_token)
    return result
  }
  
  @Get("/auth") 
  @UseGuards(AuthGuard) 
  async authData(@User() user :User) {
    const result = user;
    return result; 
  }

  @Delete("/logout")
  @UseGuards(AuthGuard)
  async logout(@Res({passthrough : true}) response : Response) {
    response.cookie("token", null, {
      maxAge : 0
    })
  }

}
