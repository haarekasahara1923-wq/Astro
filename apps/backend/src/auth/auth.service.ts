import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async signup(data: any) {
        const { email, password, name, phone, role } = data;
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === 'ASTROLOGER') {
            const existing = await this.prisma.astrologer.findFirst({
                where: { OR: [{ email: email }, { phone: phone }] },
            });
            if (existing) {
                throw new ConflictException('Astrologer with this email or phone already exists');
            }

            const astrologer = await this.prisma.astrologer.create({
                data: {
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    role: 'ASTROLOGER',
                    expertise: "",
                    languages: "",
                    experience: 0,
                    pricePerMin: 0,
                },
            });
            return this.generateToken(astrologer);
        } else {
            const existing = await this.prisma.user.findFirst({
                where: { OR: [{ email: email }, { phone: phone }] },
            });
            if (existing) {
                throw new ConflictException('User with this email or phone already exists');
            }

            const user = await this.prisma.user.create({
                data: {
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    role: 'USER',
                },
            });
            return this.generateToken(user);
        }
    }

    async login(email: string, password: string) {
        // Try finding user
        let entity: any = await this.prisma.user.findUnique({ where: { email } });

        // If not user, try astrologer
        if (!entity) {
            entity = await this.prisma.astrologer.findUnique({ where: { email } });
        }

        if (!entity) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, entity.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(entity);
    }

    private generateToken(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email,
                phone: user.phone
            }
        };
    }
}
