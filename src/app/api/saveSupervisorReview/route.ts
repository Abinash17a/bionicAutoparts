import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      supervisorName,
      employeeName,
      reviewDate,
      rating,
      comments,
      department,
      strengths,
      areasForImprovement,
      goals,
      nextReviewDate
    } = body

    // Validate required fields
    if (!supervisorName || !employeeName || !reviewDate || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: supervisorName, employeeName, reviewDate, and rating are required' },
        { status: 400 }
      )
    }

    // Validate rating (1-5)
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Save to Firebase
    const docRef = await addDoc(collection(db, 'supervisorReviews'), {
      supervisorName,
      employeeName,
      reviewDate,
      rating,
      comments: comments || '',
      department: department || '',
      strengths: strengths || '',
      areasForImprovement: areasForImprovement || '',
      goals: goals || '',
      nextReviewDate: nextReviewDate || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return NextResponse.json({
      success: true,
      message: 'Supervisor review saved successfully',
      reviewId: docRef.id
    })

  } catch (error) {
    console.error('Error saving supervisor review:', error)
    return NextResponse.json(
      { error: 'Failed to save supervisor review' },
      { status: 500 }
    )
  }
} 