import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appServive: AppService) {}

  @Get()
  async getHello() {
    return this.appServive.getHello();
  }
}
