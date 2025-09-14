import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use(
	async (config) => {
		const session = await getSession();
		if (session?.accessToken) {
			config.headers.Authorization = `Bearer ${session.accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const session = await getSession();

		if (session?.error === 'RefreshAccessTokenError') {
			console.error('Refresh token is invalid. Forcing sign out.');
			// The signOut function will redirect to the login page
			await signOut({ callbackUrl: '/admin/login' });
		}

		return Promise.reject(error);
	}
);

export default api;
