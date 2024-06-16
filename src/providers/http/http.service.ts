import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpCustomService {
  constructor(private readonly httpService: HttpService) {}
  public async apiFindAll() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://api.artic.edu/api/v1/artworks'),
      );
      return response.data;
    } catch (error) {
      return new HttpException(
        'Error en la conexión a la API',
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }
  }
}
