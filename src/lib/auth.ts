import NextAuth from "next-auth"
import { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/db"

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

class LockoutError extends CredentialsSignin {
  code = "LOCKOUT"
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.isActive) return null

        if (user.lockoutUntil && user.lockoutUntil > new Date()) {
          throw new LockoutError()
        }

        const isValid = await compare(password, user.passwordHash)
        if (!isValid) {
          const attempts = user.loginAttempts + 1
          const lockoutUntil =
            attempts >= MAX_LOGIN_ATTEMPTS
              ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
              : null

          await prisma.user.update({
            where: { id: user.id },
            data: { loginAttempts: attempts, lockoutUntil },
          })

          return null
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date(), loginAttempts: 0, lockoutUntil: null },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
})
