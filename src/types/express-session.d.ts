import 'express-session';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>; // DO NOT MODIFY THIS!

    // Our example app's custom session properties:
    authenticatedUser: {
      userId: string;
      userName: string;
      email: string;
    };
    isLoggedIn: boolean;
    logInAttempts: number;
    logInTimeout: string; // Date
    coins: number;
  }
}
