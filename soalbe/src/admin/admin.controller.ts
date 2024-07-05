import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from 'types/customRequest';
import { AuthGuard } from 'src/app.guard';
import { ZSoal } from 'types/soalTypes';
import { ZLogin } from 'types/loginTypes';
import { z } from 'zod';
import { AdminGuard } from 'src/adminGuard';

@Controller("/admin")
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly appService: AdminService) {}

  @Get()
  getHello(@User() user : User): string {
    return this.appService.getHello(user);
  }


  @Get("soal")
  async getSoalAll() {
    return this.appService.getSoalAll()
  }
  @Get("soal/:id")
  async getSoal(@Param("id") id) {
    return this.appService.getSoal(parseInt(id))
  }
  @Get("jawaban/:id")
  async getJawaban(@Param("id") id) {
    return this.appService.getSoalJawaban(parseInt(id))
  }
  @Post("soal")
  async createSoal(@Body() body) {

    const validation = ZSoal.safeParse(body)
    if(validation.success == false) {
      throw new HttpException("Invalid Data", HttpStatus.BAD_REQUEST)
    }
    return this.appService.createSoal(validation.data)
  }
  @Put("soal/:id")
  async editSoal(@Body() body, @Param("id") id : string) {

    const validation = ZSoal.safeParse(body)
    if(validation.success == false) {
      throw new HttpException("Invalid Data", HttpStatus.BAD_REQUEST)
    }
    return this.appService.editSoal(validation.data, parseInt(id))
  }
  @Delete("soal/:id")
  async deleteSoal(@Param("id") id : string) {
    return this.appService.deleteSoal(parseInt(id))
  }

  @Post("user")
  async createUser(@Body() body) {

    const validation = ZLogin.safeParse(body)
    if(validation.success == false) {
      throw new HttpException("Invalid Data", HttpStatus.BAD_REQUEST)
    }
    return this.appService.createUser(validation.data)
  }
  @Get("user")
  async getUser() {

    return this.appService.getAllUser()
  }
  @Put("user/username/:id")
  async editUsername(@Body() body, @Param("id") id : string) {

    const validation = z.object({
      username : z.string().min(1)
    }).safeParse(body)
    if(validation.success == false) {
      throw new HttpException("Invalid Data", HttpStatus.BAD_REQUEST)
    }
    return this.appService.editUserName(parseInt(id), validation.data.username)
  }
  @Put("user/password/:id")
  async editPassword(@Body() body, @Param("id") id : string) {

    const validation = z.object({
      password : z.string().min(1)
    }).safeParse(body)
    if(validation.success == false) {
      throw new HttpException("Invalid Data", HttpStatus.BAD_REQUEST)
    }
    return this.appService.editUserPassword(parseInt(id), validation.data.password)
  }

  @Delete("user/:id")
  async deleteUser(@Param("id") id : string) {
    return this.appService.deleteUser(parseInt(id))
  }




}
