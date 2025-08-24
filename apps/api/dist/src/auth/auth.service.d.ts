import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export interface LoginDto {
    email: string;
    password: string;
}
export interface LoginResponse {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<LoginResponse>;
    validateToken(token: string): Promise<any>;
}
