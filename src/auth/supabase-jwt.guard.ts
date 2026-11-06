import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  private supabase: SupabaseClient | null = null;

  constructor(private prisma: PrismaService) { 
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (url && key) {
      this.supabase = createClient(url, key);
    } else {
      console.warn('⚠️ SUPABASE_URL or SUPABASE_ANON_KEY not set. Running in local/dev authorization mode.');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Missing Authorization');

    const token = authHeader.replace('Bearer ', '');

    // 1. Dev / Mock token fallback for local full-stack operation
    if (token.startsWith('mock-token-') || !this.supabase) {
      const mockId = token.replace('mock-token-', '');
      let user = await this.prisma.user.findFirst({
        where: { OR: [{ id: mockId }, { role: 'HQ_ADMIN' }] },
      });

      // If database is clean/empty, provide a default admin user payload
      if (!user) {
        req.user = {
          id: mockId || 'dev-admin-id',
          email: 'admin@ethiotelecom.et',
          role: 'HQ_ADMIN',
          branchId: null,
        };
        return true;
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
      };
      return true;
    }

    // 2. Production Supabase JWT Verification
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data.user) throw new UnauthorizedException('Invalid token');

    // Fetch user role from local DB
    const user = await this.prisma.user.findUnique({
      where: { id: data.user.id },
    });

    if (!user) throw new UnauthorizedException('User not found in DB');

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      branchId: user.branchId,
    };

    return true;
  }
}
