import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Types } from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ApiTokenService {
  constructor(private readonly httpService: HttpService) {}

  async sendBearerToken(
    token: string | undefined | any,
  ): Promise<Types.ObjectId> {
    if (token === undefined)
      throw new HttpException('Bad token', HttpStatus.UNAUTHORIZED);
    if (typeof token !== 'string')
      throw new HttpException('Bad token', HttpStatus.FORBIDDEN);

    const response = await firstValueFrom(
      this.httpService
        .get<Types.ObjectId>(process.env.AUTH_API_URL, {
          headers: {
            Authorization: token,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(
              'Bad token',
              error.response?.status || HttpStatus.BAD_GATEWAY,
            );
          }),
        ),
    );

    return response.data;
  }
}
