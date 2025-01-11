
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DeveloperProfile {
  bio: string
  github: string
  portfolio: string
  hourlyRate: string
  availability: string
  technologies: string[]
  experience: string
}

export default function OnBoarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [userType, setUserType] = useState<'user' | 'developer' | null>(null)
  const [developerProfile, setDeveloperProfile] = useState<DeveloperProfile>({
    bio: '',
    github: '',
    portfolio: '',
    hourlyRate: '',
    availability: '',
    technologies: [],
    experience: ''
  })

  const handleUserTypeSelect = (value: string) => {
    setUserType(value as 'user' | 'developer')
    if (value === 'user') {
      router.push('/dashboard')
    } else {
      setStep(1)
    }
  }

  const handleNextStep = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      router.push('/developer/profile')
    }
  }

  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const updateDeveloperProfile = (field: keyof DeveloperProfile, value: string | string[]) => {
    setDeveloperProfile(prev => ({ ...prev, [field]: value }))
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome! Let's get started</h1>
            <p className="text-gray-400">Are you a developer or a user?</p>
            <Select onValueChange={handleUserTypeSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Developer Profile (Step 1 of 2)</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={developerProfile.bio}
                  onChange={(e) => updateDeveloperProfile('bio', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub Profile</Label>
                <Input
                  id="github"
                  value={developerProfile.github}
                  onChange={(e) => updateDeveloperProfile('github', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="portfolio">Portfolio URL</Label>
                <Input
                  id="portfolio"
                  value={developerProfile.portfolio}
                  onChange={(e) => updateDeveloperProfile('portfolio', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Developer Profile (Step 2 of 2)</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={developerProfile.hourlyRate}
                  onChange={(e) => updateDeveloperProfile('hourlyRate', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={developerProfile.availability}
                  onValueChange={(value) => updateDeveloperProfile('availability', value)}
                >
                  <SelectTrigger id="availability" className="mt-1">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input
                  id="technologies"
                  value={developerProfile.technologies.join(', ')}
                  onChange={(e) => updateDeveloperProfile('technologies', e.target.value.split(',').map(tech => tech.trim()))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={developerProfile.experience}
                  onChange={(e) => updateDeveloperProfile('experience', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-1/2 p-8 flex flex-col justify-center">
        {renderStep()}
        {step > 0 && (
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrevStep}>
              Previous
            </Button>
            <Button onClick={handleNextStep}>
              {step === 2 ? 'Finish' : 'Next'}
            </Button>
          </div>
        )}
      </div>
      <div className="w-1/2 relative">
        <Image
          src="https://plus.unsplash.com/premium_photo-1661544852949-eb73ce3cf6f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHZpZGVvJTIwY2FsbHxlbnwwfHwwfHx8MA%3D%3D"
          alt="Onboarding"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  )
}

