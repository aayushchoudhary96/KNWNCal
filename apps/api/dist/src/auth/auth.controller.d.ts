import { AuthService, LoginDto } from './auth.service';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto): Promise<import("./auth.service").LoginResponse>;
    getProfile(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        clientId: string;
    }>;
}
