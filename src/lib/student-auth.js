'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

const StudentAuthContext = createContext({});

export function StudentAuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Check if user is authenticated on mount
	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			const token = localStorage.getItem('studentAccessToken');
			if (token) {
				// Set the token in api defaults
				api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
				
				// Verify the token is valid
				const response = await api.get('/auth/me');
				if (response.data.success) {
					setUser(response.data.data);
				} else {
					localStorage.removeItem('studentAccessToken');
					delete api.defaults.headers.common['Authorization'];
				}
			}
		} catch (error) {
			console.error('Auth check failed:', error);
			localStorage.removeItem('studentAccessToken');
			delete api.defaults.headers.common['Authorization'];
		} finally {
			setLoading(false);
		}
	};

	const login = async (email, password) => {
		try {
			const response = await api.post('/auth/login', { email, password });

			if (response.data.success) {
				const { user: userData, accessToken } = response.data.data;

				// Only allow non-admin users
				if (userData.role === 'Admin') {
					throw new Error('Access Denied: This login is for students only. Please use admin login.');
				}

				// Store token and set user
				localStorage.setItem('studentAccessToken', accessToken);
				api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
				setUser(userData);

				return { success: true };
			} else {
				throw new Error(response.data.message || 'Login failed');
			}
		} catch (error) {
			const message = error.response?.data?.message || error.message || 'Login failed';
			return { success: false, error: message };
		}
	};

	const loginWithGoogle = () => {
		window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
	};

	const handleGoogleCallback = (token) => {
		localStorage.setItem('studentAccessToken', token);
		api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		checkAuth();
	};

	const logout = async () => {
		try {
			await api.post('/auth/logout');
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			localStorage.removeItem('studentAccessToken');
			delete api.defaults.headers.common['Authorization'];
			setUser(null);
		}
	};

	const value = {
		user,
		login,
		loginWithGoogle,
		handleGoogleCallback,
		logout,
		loading,
		isAuthenticated: !!user,
	};

	return (
		<StudentAuthContext.Provider value={value}>
			{children}
		</StudentAuthContext.Provider>
	);
}

export function useStudentAuth() {
	const context = useContext(StudentAuthContext);
	if (context === undefined) {
		throw new Error('useStudentAuth must be used within a StudentAuthProvider');
	}
	return context;
}