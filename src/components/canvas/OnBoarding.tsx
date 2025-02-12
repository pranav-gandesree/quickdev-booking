'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'

interface DeveloperProfile {
  bio: string
  github: string
  portfolio: string
  hourlyRate: string
  availability: string
  technologies: string[]
  experience: string
  walletAddress: string
}

export default function OnBoarding() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [userType, setUserType] = useState<'USER' | 'DEVELOPER' | null>(null)
  const [developerProfile, setDeveloperProfile] = useState<DeveloperProfile>({
    bio: '',
    github: '',
    portfolio: '',
    hourlyRate: '',
    availability: '',
    technologies: [''],
    experience: '',
    walletAddress: ''
  })

  const handleRoleChange = async (role: 'USER' | 'DEVELOPER') => {
    setUserType(role)
  }

useEffect(()=>{
  console.log("session is ", session)

}, [session])

  const handleSubmitProfile = async () => {
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userType,
          developerProfile
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated!',
        })
        

          router.push('/dashboard')
       
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    }
  }


  const handleNext = () =>{
    if (userType === 'USER') {
        router.push('/dashboard')
      } else {
        setStep(1)
      }
  }

  const handleNextStep = async() => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      await handleSubmitProfile()
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

            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  className="mt-1"
                  onChange={() => handleRoleChange('USER')}
                />
                <div>
                  <span className="font-bold">User</span>
                  <p className="text-gray-500 text-sm">
                    Select this option if you want to explore the platform as a user.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="role"
                  value="developer"
                  className="mt-1"
                  onChange={() => handleRoleChange('DEVELOPER')}
                />
                <div>
                  <span className="font-bold">Developer</span>
                  <p className="text-gray-500 text-sm">
                    Choose this option if you want to contribute or manage projects as a developer.
                  </p>
                </div>
              </label>
            </div>

            <Button onClick={handleNext}>Next</Button>
           
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
                <Label htmlFor="walletAddress">Hourly Rate ($)</Label>
                <Input
                  id="walletAddress"
                  type="string"
                  value={developerProfile.walletAddress}
                  onChange={(e) => updateDeveloperProfile('walletAddress', e.target.value)}
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
                    <SelectItem value="true">Available</SelectItem>
                    <SelectItem value="false">Not Available</SelectItem>
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






































