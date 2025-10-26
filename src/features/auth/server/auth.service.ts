/**
 * Reason: Encapsulates business logic for the authentication feature.
 * This service layer coordinates the repository and other services to perform
 * complex operations like user signup and login, keeping the API controllers thin.
 */
import { AuthRepository } from "./auth.repository";
import { ILogin, ISignup } from "@/features/auth/auth.types";
import { decryptText } from "@/shared/lib/crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

export class AuthService {
	private authRepository = new AuthRepository();

	async signup(data: ISignup) {
		const existingUser = await this.authRepository.findUserByEmail(data.email);
		if (existingUser) {
			throw new Error("User with this email already exists");
		}
		return this.authRepository.createUser(data);
	}

	async login(data: ILogin) {
		const user = await this.authRepository.findUserByEmail(data.email);
		if (!user) {
			throw new Error("Invalid credentials");
		}

		const isValid = await bcrypt.compare(data.password, user.password);
		if (!isValid) {
			throw new Error("Invalid credentials");
		}

		const decryptedUsername = decryptText(user.username);

		const accessToken = jwt.sign(
			{ id: user.id, username: decryptedUsername },
			JWT_SECRET,
			{ expiresIn: ACCESS_TOKEN_EXPIRY },
		);

		const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
			expiresIn: REFRESH_TOKEN_EXPIRY,
		});

		return { accessToken, refreshToken };
	}
}
