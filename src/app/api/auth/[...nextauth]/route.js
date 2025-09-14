import { jwtDecode } from 'jwt-decode';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

async function refreshAccessToken(token) {
	try {
		// For development with self-signed certificates
		const fetchOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refreshToken: token.refreshToken }),
		};

		// In development, disable SSL verification for self-signed certificates
		if (process.env.NODE_ENV === 'development') {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
		}

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
			fetchOptions
		);

		const refreshedTokens = await response.json();

		if (!response.ok || !refreshedTokens.success) {
			throw new Error('Failed to refresh access token');
		}

		const newAccessToken = refreshedTokens.data.accessToken;
		const decodedNewToken = jwtDecode(newAccessToken);

		return {
			...token,
			accessToken: newAccessToken,
			accessTokenExpires: decodedNewToken.exp * 1000,
		};
	} catch (error) {
		console.error('Error refreshing access token:', error);
		return {
			...token,
			error: 'RefreshAccessTokenError',
		};
	}
}

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				console.log('Credentials in authorize function:', credentials);
				try {
					// For development with self-signed certificates
					if (process.env.NODE_ENV === 'development') {
						process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
					}

					const res = await fetch(
						`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
						{
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(credentials),
						}
					);
					const response = await res.json();

					if (res.ok && response.success) {
						const user = response.data.user;
						if (user.role !== 'Admin') {
							throw new Error('Access Denied: You must be an administrator.');
						}
						return {
							...user,
							accessToken: response.data.accessToken,
							refreshToken: response.data.refreshToken,
						};
					} else {
						throw new Error(response.message || 'Authentication failed');
					}
				} catch (error) {
					throw new Error(error.message);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				const decodedToken = jwtDecode(user.accessToken);
				token.accessToken = user.accessToken;
				token.refreshToken = user.refreshToken;
				token.accessTokenExpires = decodedToken.exp * 1000;
				token.user = {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
				};
				return token;
			}

			if (Date.now() < token.accessTokenExpires) {
				return token;
			}

			console.log('Access token has expired. Attempting to refresh...');
			return refreshAccessToken(token);
		},
		async session({ session, token }) {
			session.user = token.user;
			session.accessToken = token.accessToken;
			session.error = token.error;
			return session;
		},
	},
	pages: {
		signIn: '/admin/login',
	},
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
