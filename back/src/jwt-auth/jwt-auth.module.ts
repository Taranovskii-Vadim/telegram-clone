import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../user/user.module';
import { JwtAuthService } from './jwt-auth.service';
import { JwtAuthController } from './jwt-auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'cat',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtAuthService, LocalStrategy, JwtStrategy],
  exports: [JwtAuthService],
  controllers: [JwtAuthController],
})
export class JwtAuthModule {}
