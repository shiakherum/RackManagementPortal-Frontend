'use client';

import { useEffect, useState } from 'react';

// Simple toast implementation
let toasts = [];
let listeners = [];

export const toast = {
	success: (message) => addToast(message, 'success'),
	error: (message) => addToast(message, 'error'),
	info: (message) => addToast(message, 'info'),
};

function addToast(message, type) {
	const id = Date.now();
	const newToast = { id, message, type };
	toasts = [...toasts, newToast];
	
	listeners.forEach(listener => listener([...toasts]));
	
	// Auto remove after 3 seconds
	setTimeout(() => {
		removeToast(id);
	}, 3000);
}

function removeToast(id) {
	toasts = toasts.filter(toast => toast.id !== id);
	listeners.forEach(listener => listener([...toasts]));
}

export function Toaster() {
	const [currentToasts, setCurrentToasts] = useState([]);

	useEffect(() => {
		const listener = (newToasts) => setCurrentToasts(newToasts);
		listeners.push(listener);
		
		return () => {
			listeners = listeners.filter(l => l !== listener);
		};
	}, []);

	return (
		<div className='fixed top-4 right-4 z-50 space-y-2'>
			{currentToasts.map((toast) => (
				<div
					key={toast.id}
					className={`rounded-lg p-4 shadow-lg transition-all duration-300 ${
						toast.type === 'success'
							? 'bg-green-500 text-white'
							: toast.type === 'error'
							? 'bg-red-500 text-white'
							: 'bg-blue-500 text-white'
					}`}>
					{toast.message}
				</div>
			))}
		</div>
	);
}