import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { parseCreateCinema, parseGroupSize } from './dto/create-cinema.dto';
import { parseUpdateCinema } from './dto/update-cinema.dto';

@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  create(@Body() body: unknown) {
    return this.cinemasService.create(parseCreateCinema(body));
  }

   @Patch(':id')
   update(@Param('id', ParseIntPipe) id: number, @Body() body: unknown) {
    return this.cinemasService.update(id, parseUpdateCinema(body));
  }
   
  @Get()
  findAll() {
    return this.cinemasService.findAll();
  }

  @Get(':id/booking')
  booking(@Param('id', ParseIntPipe) id: number, @Query('groupSize') groupSize: string) {
    return this.cinemasService.booking(id, parseGroupSize(groupSize));
  }
}