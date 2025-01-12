
// import { getServerSession } from 'next-auth'
// import { NextResponse } from 'next/server'
// import prisma from '../../../../prisma/prisma'

// export async function POST(request: Request) {
//   const session = await getServerSession()
//   if (!session?.user?.email) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   const data = await request.json()
  
//   try {
//     const user = await prisma.user.update({
//       where: { email: session.user.email },
//       data: {
//         role: data.role,
//         ...(data.role === 'DEVELOPER' ? {
//           developerProfile: {
//             create: {
//               bio: data.devProfile.bio,
//               github: data.devProfile.github,
//               portfolio: data.devProfile.portfolio,
//               hourlyRate: parseFloat(data.devProfile.hourlyRate),
//               technologies: data.devProfile.technologies,
//               experience: data.devProfile.experience,
//               availability: true
//             }
//           }
//         } : {})
//       }
//     })

//     return NextResponse.json({ success: true, user })
//   } catch (error) {
//     console.error('Onboarding error:', error)
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
//   }
// }



























// app/api/onboarding/route.ts
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
              experience: developerProfile.experience
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
