import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import prisma from 'prisma/prisma';
import { User } from 'types/customRequest';
import CustomHttpError from 'types/error';
import { ILogin } from 'types/loginTypes';
import { ISoal } from 'types/soalTypes';
import { hashPassword } from 'util/bcrypt';

@Injectable()
export class AdminService {
  getHello(user: User): string {

    return 'Hello ' + user.username;
  }

  async getSoalAll() {
    try {
      const soal = await prisma.soal.findMany()
      if (soal == null) {
        throw new CustomHttpError("Tidak Menemukan Soal", HttpStatus.NOT_FOUND)
      }
      return soal
    } catch (err) {
      if (err instanceof CustomHttpError) {
        throw new HttpException(err.message, err.status)
      }
      throw new HttpException("Ada Masalah", HttpStatus.NOT_FOUND)

    }
  }
  async getSoal(soalId: number) {
    try {
      const soal = await prisma.soal.findFirst({
        where: {
          id: soalId
        }
      })

      if (soal == null) {
        throw new CustomHttpError("Tidak Menemukan Soal", HttpStatus.NOT_FOUND)
      }

      return soal
    } catch (err) {
      if (err instanceof CustomHttpError) {
        throw new HttpException(err.message, err.status)
      }
      throw new HttpException("Ada Masalah", HttpStatus.NOT_FOUND)

    }
  }

  async getSoalJawaban(soalId: number) {
    try {
      const soals = await prisma.soal.findFirst({
        where: {
          id: soalId,
        },
        include: {
          jawabans: {
            include: {
              user: {
                select: {
                  username: true,
                  id: true
                }
              }
            },
            orderBy: {
              tanggal: "asc"
            }
          }
        },

      })

      return soals
    } catch (err) {
      if (err instanceof CustomHttpError) {
        throw new HttpException(err.message, err.status)
      }
      throw new HttpException("Ada Masalah", HttpStatus.NOT_FOUND)

    }
  }

  async createSoal(soal: ISoal) {
    try {
      const newSoal = await prisma.soal.create({
        data: {
          ...soal
        }
      })

      return {
        message: "Berhasil Membuat Soal"
      }
    } catch (err) {
      if (err instanceof CustomHttpError) {
        throw new HttpException(err.message, err.status)
      }
      throw new HttpException("Ada Masalah", HttpStatus.NOT_FOUND)

    }
  }

  async editSoal(soal: ISoal, soalId: number) {
    try {
      await prisma.soal.update({
        where: {
          id: soalId,
        },
        data: soal
      })
      return {
        message: "Berhasil Mengedit Soal"
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

  async deleteSoal(id: number) {
    try {
      await prisma.soal.delete({
        where: {
          id,
        }
      })

      return {
        message: "Berhasil Mengedit Soal"
      }
    } catch (err) {
      console.log(err)
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

  async getAllUser() {
    try {
      const user = await prisma.user.findMany({
        where: {
          role: {
            not: 99
          }
        }
      })
      return user
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

  async createUser(user: ILogin) {
    try {
      const { password, ...newUser } = await prisma.user.create({
        data: {
          username: user.username,
          password: hashPassword(user.password),
          role: 1
        }
      })

      return {
        message: "Berhasil Membuat User",
        data: newUser
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

  async deleteUser(id: number) {
    try {

      console.log(id)

      await prisma.user.delete({
        where: {
          id,
        }
      })

      return {
        message: "Berhasil Menghapus User"
      }
    } catch (err) {
      console.log(err)
      if (err instanceof CustomHttpError) {

        throw new HttpException(err.message, err.status)
      }

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException("Tidak Menemukan Data User", HttpStatus.NOT_FOUND)
        }
      }
      throw new HttpException("Ada Masalah", HttpStatus.NOT_FOUND)

    }
  }

  async editUserName(userId: number, username: string) {
    try {
      const { password, ...newUser } = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username: username
        }
      })

      return {
        message: "Berhasil Mengubah Username",
        data: newUser
      }

    } catch (err) {
      if (err instanceof CustomHttpError) {
        throw new HttpException(err.message, err.status)
      }

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException("Tidak Menemukan Data User", HttpStatus.NOT_FOUND)
        }
      }
      throw new HttpException("Ada Masalah", HttpStatus.NOT_FOUND)

    }
  }
  async editUserPassword(userId: number, password: string) {
    try {
      const { password: newPass, ...newUser } = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashPassword(password)
        }
      })

      return {
        message: "Berhasil Mengubah Username",
        data: newUser
      }

    } catch (err) {
      if (err instanceof CustomHttpError) {
        throw new HttpException(err.message, err.status)
      }

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException("Tidak Menemukan Data User", HttpStatus.NOT_FOUND)
        }
      }
      throw new HttpException("Ada Masalah", HttpStatus.NOT_FOUND)

    }
  }



}
