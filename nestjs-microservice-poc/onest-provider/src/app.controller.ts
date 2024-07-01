import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('search/:clientId')
  search(@Param('clientId') clientId: string, @Body() searchData: any) {
    return this.appService.search(clientId, searchData);
  }
}
