import { User } from '../types';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

class AuthService {
  private currentUser: User | null = null;
  private users: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@company.com',
      role: 'admin',
      created_at: new Date().toISOString()
    }
  ];

  // In a real implementation, passwords would be hashed
  private credentials: Record<string, string> = {
    'admin': 'admin123'
  };

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { username, password } = credentials;
      
      // Check if user exists and password is correct
      const user = this.users.find(u => u.username === username);
      if (!user || this.credentials[username] !== password) {
        return { success: false, error: 'Invalid username or password' };
      }

      // Update last login
      user.last_login = new Date().toISOString();
      this.currentUser = user;

      // Store in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', this.generateToken(user));

      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  async register(userData: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Check if user already exists
      if (this.users.find(u => u.username === userData.username || u.email === userData.email)) {
        return { success: false, error: 'User already exists' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        role: userData.role,
        created_at: new Date().toISOString()
      };

      this.users.push(newUser);
      this.credentials[userData.username] = userData.password;

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;

    // Try to restore from localStorage
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        this.currentUser = JSON.parse(storedUser);
        return this.currentUser;
      } catch {
        this.logout();
      }
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  getAllUsers(): User[] {
    return this.users;
  }

  private generateToken(user: User): string {
    // In a real implementation, use proper JWT
    return btoa(JSON.stringify({ id: user.id, username: user.username, timestamp: Date.now() }));
  }
}

export const authService = new AuthService();