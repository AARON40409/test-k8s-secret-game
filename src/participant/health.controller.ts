// health.controller.ts
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Controller()
export class HealthController {
  constructor(private prisma: PrismaService) {}
@Get('/health')
async healthCheck() {
  try {
    // Vérifiez la connexion à la DB avec Prisma
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'connected' };
  } catch (error) {
    throw new HttpException('Database not available', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
}