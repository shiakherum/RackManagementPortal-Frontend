'use client';

import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
} from '@headlessui/react';
import {
	ArrowRightEndOnRectangleIcon,
	Bars3Icon,
	UserCircleIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Header() {
	return (
		<Disclosure
			as='nav'
			className='bg-white shadow-sm z-[999] fixed w-full top-0'>
			<header className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='flex h-16 justify-between'>
					{/* ---------------------------------------------------------------- */}
					{/* Brand + main navigation                                         */}
					{/* ---------------------------------------------------------------- */}
					<div className='flex'>
						{/* Mobile menu button */}
						<div className='mr-2 -ml-2 flex items-center md:hidden'>
							<DisclosureButton className='group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
								<span className='absolute -inset-0.5' />
								<span className='sr-only'>Open main menu</span>
								<Bars3Icon
									aria-hidden='true'
									className='block size-6 group-data-open:hidden'
								/>
								<XMarkIcon
									aria-hidden='true'
									className='hidden size-6 group-data-open:block'
								/>
							</DisclosureButton>
						</div>

						{/* logo */}
						<div className='flex shrink-0 items-center'>
							<Link href='/'>
								<img
									src='/logo-3.svg'
									alt='Your Company'
									className='h-8 w-auto'
								/>
							</Link>
						</div>

						{/* desktop links */}
						<div className='hidden md:ml-8 md:flex md:space-x-8'>
							<Link
								href='/racks'
								className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium transition text-gray-500 hover:border-gray-300 hover:text-gray-700'>
								Racks
							</Link>
							<Link
								href='/poc-solution-testing'
								className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium transition text-gray-500 hover:border-gray-300 hover:text-gray-700'>
								POC &amp; Solution Testing
							</Link>
							<Link
								href='#'
								className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium transition text-gray-500 hover:border-gray-300 hover:text-gray-700 opacity-50 cursor-not-allowed'>
								Learning
							</Link>
							<Link
								href='/about'
								className='hidden lg:inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium transition text-gray-500 hover:border-gray-300 hover:text-gray-700'>
								About Us
							</Link>
							<Link
								href='/contact'
								className='hidden lg:inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium transition text-gray-500 hover:border-gray-300 hover:text-gray-700'>
								Contact Us
							</Link>
						</div>
					</div>

					{/* ---------------------------------------------------------------- */}
					{/* Actions (new job, notifications, profile)                        */}
					{/* ---------------------------------------------------------------- */}
					<div className='flex items-center'>
						<div className='shrink-0'>
							<Link
								href='/signin'
								className='relative inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50'>
								<ArrowRightEndOnRectangleIcon
									aria-hidden='true'
									className='-ml-0.5 size-5'
								/>
								Login
							</Link>
						</div>

						{/* notification bell + profile (desktop) */}
						<div className='hidden md:ml-4 md:flex md:shrink-0 md:items-center'>
							<Link
								href='/signin'
								className='relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
								<UserCircleIcon aria-hidden='true' className='-ml-0.5 size-5' />
								Get Started
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* ------------------------------------------------------------------ */}
			{/* Mobile disclosure panel                                            */}
			{/* ------------------------------------------------------------------ */}
			<DisclosurePanel className='md:hidden'>
				<div className='space-y-1 pt-2 pb-3'>
					<DisclosureButton
						as={Link}
						href='/racks'
						className='block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6'>
						Racks
					</DisclosureButton>
					<DisclosureButton
						as={Link}
						href='/poc-solution-testing'
						className='block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6'>
						POC &amp; Solution Testing
					</DisclosureButton>
					<DisclosureButton
						as='div'
						className='block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-400 opacity-50 cursor-not-allowed sm:pl-5 sm:pr-6'>
						Learning
					</DisclosureButton>
					<DisclosureButton
						as={Link}
						href='/about'
						className='block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6'>
						About Us
					</DisclosureButton>
					<DisclosureButton
						as={Link}
						href='/contact'
						className='block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6'>
						Contact Us
					</DisclosureButton>
				</div>

				<div className='border-t border-gray-200 pt-4 pb-3'>
					<div className='space-y-1'>
						<DisclosureButton
							as={Link}
							href='/signin'
							className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6'>
							Login
						</DisclosureButton>
						<DisclosureButton
							as={Link}
							href='/signin'
							className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6'>
							Get Started
						</DisclosureButton>
					</div>
				</div>
			</DisclosurePanel>
		</Disclosure>
	);
}
