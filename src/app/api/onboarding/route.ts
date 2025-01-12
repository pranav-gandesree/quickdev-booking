
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '../../../../prisma/prisma'

export async function POST(request: Request) {
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { userType, developerProfile } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        role: userType,
        ...(userType === 'DEVELOPER' ? {
          developerProfile: {
            create: {
              bio: developerProfile.bio,
              github: developerProfile.github,
              portfolio: developerProfile.portfolio,
              hourlyRate: parseFloat(developerProfile.hourlyRate),
              availability: developerProfile.availability === 'true',
              technologies: developerProfile.technologies,
              experience: developerProfile.experience,
              walletAddress: developerProfile.walletAddress
            }
          }
        } : {})
      },
      include: {
        developerProfile: true
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
