import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../../../generated/prisma/enums';

export const ROLES_KEY = 'roles';

// Restricts a route to the given roles. Absent entirely = no restriction
// (any authenticated user). See RolesGuard for enforcement.
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
