import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { parse } from 'path';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordMatch = await bcrypt.compare(password, user.password)
          if (passwordMatch) return user;
        }

        console.log('Invalid credentials.')
        return null;
      },
    }),
  ],
});

// PASSWORD HASHING
// Need to create a separate file for the bcrypt package. This is because bcrypt relies on 
// Node.js APIs not available in Next.js Middleware.

// ADD CREDENTIALS PROVIDERS
// Need to add the providers option for NextAuth.js. providers is an array where you list 
// different login options such as Google or GitHub. For this course, we will focus on 
// using the Credentials provider only. The Credentials provider allows users to log in with a username and a password.
// There are other alternative providers such as OAuth or email.

// ADDING THE SIGN IN FUNCTIONALITY
// You can use the authorize function to handle the authentication logic. Similarly to Server Actions, you can use zod 
// to validate the email and password before checking if the user exists in the database: