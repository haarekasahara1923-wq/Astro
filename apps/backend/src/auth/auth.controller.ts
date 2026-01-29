import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LoginDto } from './dto/login.dto'; 
// import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() body: any) { // using any for now, replace with DTO
        return this.authService.signup(body);
    }

    @Post('login')
    async login(@Body() body: any) {
        return this.authService.login(body.email, body.password);
    }
}
