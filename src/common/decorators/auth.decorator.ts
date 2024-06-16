/*
import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { ACGuard, Role, UseRoles } from 'nest-access-control';

export function Auth(...roles: Role[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, ACGuard), UseRoles(...roles));
}
*/

import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
