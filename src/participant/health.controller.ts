// health.controller.ts
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';

@Controller('v1/health')
export class HealthController {
  constructor(private prisma: PrismaService) {}
@ApiTags('APIs health')
@Get('/health')
@ApiResponse({
  status: 200,
  description: 'Vérifie la santé de l\'application et la connexion à la base de données.',
})
@ApiOperation({ summary: 'Vérifie la santé de l\'application et la connexion à la base de données.' })
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