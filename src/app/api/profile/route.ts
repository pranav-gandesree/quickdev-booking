
// app/api/profile/route.ts
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '../../../../prisma/prisma'

export async function GET() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { developerProfile: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role
      },
      developerProfile: user.developerProfile
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { profile, developerProfile } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: profile.name,
        ...(profile.role === 'DEVELOPER' ? {
          developerProfile: {
            upsert: {
              create: {
                bio: developerProfile.bio,
                github: developerProfile.github,
                portfolio: developerProfile.portfolio,
                hourlyRate: developerProfile.hourlyRate,
                availability: developerProfile.availability,
                technologies: developerProfile.technologies,
                experience: developerProfile.experience
              },
              update: {
                bio: developerProfile.bio,
                github: developerProfile.github,
                portfolio: developerProfile.portfolio,
                hourlyRate: developerProfile.hourlyRate,
                availability: developerProfile.availability,
                technologies: developerProfile.technologies,
                experience: developerProfile.experience
              }
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
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
