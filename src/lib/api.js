import axios from 'axios';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use(
	(config) => {
		// Check if running in browser (not SSR)
		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('studentAccessToken');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
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
