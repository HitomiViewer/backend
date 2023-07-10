import { Strategy } from 'passport-local';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy, 'login') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'id',
      passwordField: 'password',
    });
  }

  async validate(id: string, password: string) {
    return await this.authService.validateUser(id, password);
  }
}
