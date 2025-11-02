import axios from 'axios';

const adminApi = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://acirackrentals.com:5443/api/v1',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

export default adminApi;
