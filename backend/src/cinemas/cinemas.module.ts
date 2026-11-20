import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CinemasController } from './cinemas.controller';
import { CinemasService } from './cinemas.service';
import { Cinema } from './entities/cinema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cinema])],
  controllers: [CinemasController],
  providers: [CinemasService],
})
export class CinemasModule {}