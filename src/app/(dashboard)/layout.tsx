
'use client';

import React from 'react';
import Head from 'next/head';
import Sidebar from '@/components/canvas/Sidebar';

type LayoutProps = {
  pageTitle?: string;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ pageTitle, children }) => {
  const siteTitle = 'Responsive Sidebar Example';
  const title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

        <div className="flex min-h-screen bg-[#262526]">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-6 bg-[#0D1117] text-blue-500">{children}</main>
          </div>
    </>
  );
};

export default Layout;
