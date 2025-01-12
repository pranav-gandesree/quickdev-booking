// app/profile/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from '@/hooks/use-toast'

interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  role: 'USER' | 'DEVELOPER'
}

interface DeveloperProfile {
  bio: string | null
  github: string | null
  portfolio: string | null
  hourlyRate: number | null
  availability: boolean
  technologies: string[]
  experience: string | null
}

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [devProfile, setDevProfile] = useState<DeveloperProfile | null>(null)
  const toast = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (!response.ok) throw new Error('Failed to fetch profile')
        const data = await response.json()
        setProfile(data.user)
        setDevProfile(data.developerProfile)
      } catch (error) {
        toast.toast({
          title: 'Error',
          description: 'Failed to load profile',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    if (session) fetchProfile()
  }, [session])

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          developerProfile: devProfile
        }),
      })

      if (!response.ok) throw new Error('Failed to update profile')

      toast.toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })
      setIsEditing(false)
    } catch (error) {
      toast.toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
    }
  }

  if (status === 'unauthenticated') {
    router.push('/')
    return null
  }

  if (loading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Profile</CardTitle>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Basic Profile Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled={true}
                />
              </div>
            </div>

            {/* Developer-specific Profile */}
            {profile.role === 'DEVELOPER' && devProfile && (
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">Developer Information</h3>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={devProfile.bio || ''}
                    onChange={(e) => setDevProfile({ ...devProfile, bio: e.target.value })}
                    disabled={!isEditing}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="github">GitHub Profile</Label>
                  <Input
                    id="github"
                    value={devProfile.github || ''}
                    onChange={(e) => setDevProfile({ ...devProfile, github: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <Input
                    id="portfolio"
                    value={devProfile.portfolio || ''}
                    onChange={(e) => setDevProfile({ ...devProfile, portfolio: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={devProfile.hourlyRate || ''}
                    onChange={(e) => setDevProfile({ ...devProfile, hourlyRate: parseFloat(e.target.value) })}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={devProfile.availability ? 'true' : 'false'}
                    onValueChange={(value) => setDevProfile({ ...devProfile, availability: value === 'true' })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="availability">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Available</SelectItem>
                      <SelectItem value="false">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="technologies">Technologies</Label>
                  <Input
                    id="technologies"
                    value={devProfile.technologies.join(', ')}
                    onChange={(e) => setDevProfile({ 
                      ...devProfile, 
                      technologies: e.target.value.split(',').map(t => t.trim())
                    })}
                    disabled={!isEditing}
                    placeholder="React, Node.js, TypeScript, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    value={devProfile.experience || ''}
                    onChange={(e) => setDevProfile({ ...devProfile, experience: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}