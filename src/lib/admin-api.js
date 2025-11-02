import axios from 'axios';
import { signOut } from 'next-auth/react';

const adminApi = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://acirackrentals.com:5443/api/v1',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add response interceptor to handle 401 errors
adminApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			// Clear session and redirect to login
			await signOut({ callbackUrl: '/admin/login', redirect: true });
		}
		return Promise.reject(error);
	}
);

export default adminApi;
