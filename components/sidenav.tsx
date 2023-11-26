'use client';

import React, { useState } from 'react';
import { GetServerSideProps } from 'next';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { SIDENAV_ITEMS } from '@/styles/constants';
import { SideNavItem } from '@/styles/types';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const SideNav = () => {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <div class_name="md:w-60 h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex ">
            <div class_name="flex flex-col w-full ">
                <div class_name="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full">
                    {/* <span class_name="h-7 w-7 bg-zinc-300 rounded-lg" />
                    <span class_name="font-bold text-xl hidden md:flex">FitnessNow</span> */}
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={100}
                        height={100}
                        priority={true}
                    />
                </div>
                <div class_name='pt-10 md:px-6'>
                    <h1 class_name='text-2xl font-bold md:px-2 pt-6'>Menu</h1>
                    <div class_name="flex flex-col pt-6 space-y-4">
                        {SIDENAV_ITEMS.map((item, idx) => {
                            return <MenuItem key={idx} item={item} />;
                        })}
                    </div>
                    <button
                        onClick={handleLogout}
                        class_name="flex flex-row items-center p-2 my-4 rounded-lg w-full hover:bg-zinc-100">
                        <div class_name="flex flex-row space-x-4 items-center">
                            <Icon icon="carbon:logout" width="24" height="24"/>
                            <span class_name="font-semibold text-xl flex ">Logout</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    return (
        <div class_name="">
            {item.submenu ? (
                <>
                    <button
                        onClick={toggleSubMenu}
                        class_name={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-100 ${
                            pathname.includes(item.path) ? 'bg-zinc-100' : ''
                        }`}
                    >
                        <div class_name="flex flex-row space-x-4 items-center">
                            {item.icon}
                            <span class_name="font-semibold text-xl  flex">{item.title}</span>
                        </div>

                        <div class_name={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
                            <Icon icon="lucide:chevron-down" width="24" height="24" />
                        </div>
                    </button>

                    {/* {subMenuOpen && (
                        <div class_name="my-2 ml-12 flex flex-col space-y-4">
                            {item.subMenuItems?.map((subItem, idx) => {
                                return (
                                    <Link
                                        key={idx}
                                        href={subItem.path}
                                        class_name={`${
                                            subItem.path === pathname ? 'font-bold' : ''
                                        }`}
                                    >
                                        <span>{subItem.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )} */}
                </>
            ) : (
                <Link
                    href={item.path}
                    class_name={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${
                        item.path === pathname ? 'bg-white' : ''
                    }`}
                >
                    {item.icon}
                    <span class_name="font-semibold text-xl flex">{item.title}</span>
                </Link>
            )}
        </div>
    );
};