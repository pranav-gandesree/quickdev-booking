


"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import {
  LayoutDashboard,
  User,
  Plus,
  Menu,
  X,
  Trophy,
  Home
} from 'lucide-react'

const routes = [
    {
        path: '/home',
        name: 'Home',
        icon: Home
      },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    path: '/profile',
    name: 'Profile',
    icon: User
  },
  
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0  text-white">
        <div className="p-6 flex items-center gap-2">
          <h1 className="text-xl font-bold">Quick Dev</h1>
        </div>

        <nav className="flex-1 px-4">
          {routes.map((route) => {
            const Icon = route.icon
            const isActive = pathname === route.path

            return (
              <Link
                key={route.path}
                href={route.path}
                className={`
                  flex items-center gap-4 px-4 py-3 mb-2 rounded-lg
                  transition-colors duration-200
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-black'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{route.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed md:hidden top-0 left-0 z-40 h-screen w-64 flex flex-col bg-background border-r border-border"
            >
              <div className="p-6 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Bounty Manager</h1>
              </div>

              <nav className="flex-1 px-4">
                {routes.map((route) => {
                  const Icon = route.icon
                  const isActive = pathname === route.path

                  return (
                    <Link
                      key={route.path}
                      href={route.path}
                      className={`
                        flex items-center gap-4 px-4 py-3 mb-2 rounded-lg
                        transition-colors duration-200
                        ${isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                        }
                      `}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{route.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </motion.aside>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black md:hidden z-30"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}