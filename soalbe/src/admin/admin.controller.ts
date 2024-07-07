import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from 'types/customRequest';
import { AuthGuard } from 'src/app.guard';
import { ZSoal } from 'types/soalTypes';
import { ZLogin } from 'types/loginTypes';
import { z } from 'zod';
import { AdminGuard } from 'src/adminGuard';
import { java } from 'compile-run';
import { stderr } from 'process';

@Controller("/admin")
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly appService: AdminService) { }

  @Get()
  getHello(@User() user: User): string {
    return this.appService.getHello(user);
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
      const rataRata = {
        memory: 0,
        waktu: 0
      }

      let output = ""

      for (let i = 0; i < 10; i++) {
        const result = await java.runSource(getSoalCode + "\n" + validation.data.code, {
          executionPath: "java",
          compilationPath: "javac",
          stdin: "",
          compilerArgs: "-ea"
        })
        if (result.stderr.length > 0) {
          return {
            stdout : result.stdout,
            stderr : result.stderr
          }
        }
        rataRata.memory += result.memoryUsage
        rataRata.waktu += result.cpuUsage
        if(i == 0) {
          output = result.stdout
        }
      }

      return {
        memory : rataRata.memory/10,
        waktu : rataRata.waktu/10,
        stdout : output
      }

    } catch (err) {
      throw new HttpException("Ada Masalah", HttpStatus.INTERNAL_SERVER_ERROR)
    }
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
    if (validation.success == false) {
      throw new HttpException("Invalid Data", HttpStatus.BAD_REQUEST)
    }
    return this.appService.createSoal(validation.data)
  }
  @Put("soal/:id")
  async editSoal(@Body() body, @Param("id") id: string) {

    const validation = ZSoal.safeParse(body)
    if (validation.success == false) {
      throw new HttpException("Invalid Data", HttpStatus.BAD_REQUEST)
    }
    return this.appService.editSoal(validation.data, parseInt(id))
  }
  @Delete("soal/:id")
  async deleteSoal(@Param("id") id: string) {
    return this.appService.deleteSoal(parseInt(id))
  }

  @Post("user")
  async createUser(@Body() body) {

    const validation = ZLogin.safeParse(body)
    if (validation.success == false) {
      throw new HttpException("Invalid Data", HttpStatus.BAD_REQUEST)
    }
    return this.appService.createUser(validation.data)
  }
  @Get("user")
  async getUser() {

    return this.appService.getAllUser()
  }
  @Put("user/username/:id")
  async editUsername(@Body() body, @Param("id") id: string) {

    const validation = z.object({
      username: z.string().min(1)
    }).safeParse(body)
    if (validation.success == false) {
      throw new HttpException("Invalid Data", HttpStatus.BAD_REQUEST)
    }
    return this.appService.editUserName(parseInt(id), validation.data.username)
  }
  @Put("user/password/:id")
  async editPassword(@Body() body, @Param("id") id: string) {

    const validation = z.object({
      password: z.string().min(1)
    }).safeParse(body)
    if (validation.success == false) {
      throw new HttpException("Invalid Data", HttpStatus.BAD_REQUEST)
    }
    return this.appService.editUserPassword(parseInt(id), validation.data.password)
  }

  @Delete("user/:id")
  async deleteUser(@Param("id") id: string) {
    return this.appService.deleteUser(parseInt(id))
  }




}
