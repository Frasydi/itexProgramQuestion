import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ZLogin } from 'types/loginTypes';
import { Response } from 'express';
import { AuthGuard } from 'src/app.guard';
import { User } from 'types/customRequest';
import { ZJawaban } from 'types/jawabanTypes';
import { z } from 'zod';
import {java} from "compile-run"
@Controller("/user")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly appService: UserService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/soal")
  async getSoal(@User() user: User) {
    return await this.appService.getSoals(user.id);
  }

  @Get("/soal/:id")
  async getSoalId(@User() user: User, @Param("id") id ) {
    return await this.appService.getSoal(user.id, parseInt(id));
  }
  @Post("/jawaban/:id")
  async Jawaban(@User() user: User, @Body() body, @Param("id") id: string) {

    const validation = ZJawaban.safeParse(body)
    console.log(validation.error)
    if (validation.success == false) {
      throw new HttpException("Invalid Data", HttpStatus.BAD_REQUEST)
    }

    return await this.appService.createJawaban(user.id, parseInt(id), validation.data);
  }


  @Post("/code")
  async jawaban(@Body() body, @Res({ passthrough: true }) response: Response) {
    try {
      const validation = z.object({
        code: z.string().min(1)
      }).safeParse(body)

      if (validation.success == false) {
        throw new HttpException("Invalid Data", HttpStatus.BAD_REQUEST)
      }
      const result = await java.runSource(validation.data.code, {
        executionPath: "java",
        compilationPath: "javac",
        stdin: "",
        compilerArgs :"-ea"
      })
      
      return result

    } catch (err) {
      throw new HttpException("Ada Masalah", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  @Post("/code/:id")
  async jawabanSoal(@Body() body, @Res({ passthrough: true }) response: Response, @Param("id") id) {
    try {
      const validation = z.object({
        code: z.string().min(1)
      }).safeParse(body)

      if (validation.success == false) {
        throw new HttpException("Invalid Data", HttpStatus.BAD_REQUEST)
      }

      const getSoalCode = await this.appService.getSoalCodePenentu(parseInt(id))

      const result = await java.runSource(getSoalCode+"\n"+validation.data.code, {
        executionPath: "java",
        compilationPath: "javac",
        stdin: "",
        compilerArgs :"-ea"
      })
      
      return result

    } catch (err) {
      throw new HttpException("Ada Masalah", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }





}
