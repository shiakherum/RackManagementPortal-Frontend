import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
	async (config) => {
		// Check if running in browser (not SSR)
		if (typeof window !== 'undefined') {
			// First try to get Next Auth session (for admin)
			const session = await getSession();
			if (session?.accessToken) {
				config.headers.Authorization = `Bearer ${session.accessToken}`;
			} else {
				// Fall back to student authentication token
				const studentToken = localStorage.getItem('studentAccessToken');
				if (studentToken) {
					config.headers.Authorization = `Bearer ${studentToken}`;
				}
			}
		}

		// Set Content-Type AFTER auth headers, and only if not FormData
		// When data is FormData, axios will automatically set the correct Content-Type with boundary
		if (!(config.data instanceof FormData)) {
			config.headers['Content-Type'] = 'application/json';
		}

		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		// Handle 401 errors by clearing invalid tokens
		if (error.response?.status === 401 && typeof window !== 'undefined') {
			localStorage.removeItem('studentAccessToken');
			delete api.defaults.headers.common['Authorization'];
		}
		return Promise.reject(error);
	}
);

export default api;
