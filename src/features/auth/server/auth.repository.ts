/**
 * Reason: Centralizes all database operations for the User model.
 * This repository pattern abstracts away the Prisma client, making the service layer
 * cleaner and easier to test. It handles all direct interactions with the database.
 */
import bcrypt from "bcrypt";
import type { ISignup } from "@/features/auth/auth.types";
import { encryptEmail, encryptText } from "@/shared/lib/crypto";
import prisma from "@/shared/lib/prisma";

export class AuthRepository {
  async findUserByEmail(email: string) {
    const encryptedEmail = encryptEmail(email);
    return await prisma.user.findUnique({
      where: { email: encryptedEmail },
    });
  }

  async createUser(data: ISignup) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const encryptedUsername = encryptText(data.username);
    const encryptedEmail = encryptEmail(data.email);

    return await prisma.user.create({
      data: {
        username: encryptedUsername,
        email: encryptedEmail,
        password: hashedPassword,
      },
    });
  }
}
