import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import prisma from 'prisma/prisma';
import CustomHttpError from 'types/error';
import { IJawaban } from 'types/jawabanTypes';
import { ILogin } from 'types/loginTypes';
import { checkPassword } from 'util/bcrypt';
@Injectable()
export class UserService {


  getHello(): string {
    return 'Hello World!';
  }


  async getSoals(id: number) {
    try {
      const soals = await prisma.soal.findMany({
        select: {
          jawabans: {
            where: {
              user: {
                id
              }
            }
          },
          id: true,
          codePenentu: true,
          nama: true,
          soal: true
        }
      });


      return soals
    } catch (err) {
      if (err instanceof CustomHttpError) {
        throw new HttpException(err.message, err.status)
      }
      throw new HttpException("Ada Masalah", HttpStatus.NOT_FOUND)

    }
  }
  async getSoal(id: number, idSoal: number) {
    try {
      const soals = await prisma.soal.findFirst({
        where: {
          id: idSoal
        },
        select: {
          jawabans: {
            where: {
              user: {
                id
              }
            }
          },
          id: true,
          codePenentu: true,
          nama: true,
          soal: true
        }
      });


      return soals
    } catch (err) {
      if (err instanceof CustomHttpError) {
        throw new HttpException(err.message, err.status)
      }
      throw new HttpException("Ada Masalah", HttpStatus.NOT_FOUND)

    }
  }

  async getSoalCodePenentu(id:number) {
    try {
      const data = await prisma.soal.findFirst({
        where : {
          id 
        },
        select : {
          codeAwal : true
        }
      })
      if(data == null) throw new CustomHttpError("Tidak Menemukan Data", HttpStatus.NOT_FOUND)
        return data.codeAwal
      }catch(err) {
      if (err instanceof CustomHttpError) {
        throw new HttpException(err.message, err.status)
      }
      throw new HttpException("Ada Masalah", HttpStatus.NOT_FOUND)

    }
  }


  async createJawaban(userId: number, soalId: number, jawaban: IJawaban) {
    try {
      const curJawaban = await prisma.jawaban.findFirst({
        where: {
          userId,
          soalId
        }
      })

      if (curJawaban == null) {
        await prisma.jawaban.create({
          data: {
            ...jawaban,
            soalId: soalId,
            userId: userId
          }
        })
      } else {
        await prisma.jawaban.update({
          where: {
            id: curJawaban.id
          },
          data: {
            ...jawaban
          }
        })
      }

      return {
        message: "Berhasil Membuat Jawaban"
      }
    } catch (err) {
      if (err instanceof CustomHttpError) {
        throw new HttpException(err.message, err.status)
      }

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException("Tidak Menemukan Data Soal", HttpStatus.NOT_FOUND)
        }
      }

      throw new HttpException("Ada Masalah", HttpStatus.NOT_FOUND)

    }
  }


}
