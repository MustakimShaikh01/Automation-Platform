import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            tenantId: any;
            avatarUrl: any;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            tenantId: any;
            avatarUrl: any;
        };
    }>;
    googleAuth(): void;
    googleCallback(req: any, res: any): Promise<any>;
    me(req: any): Promise<any>;
    refresh(req: any): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            tenantId: any;
            avatarUrl: any;
        };
    }>;
}
