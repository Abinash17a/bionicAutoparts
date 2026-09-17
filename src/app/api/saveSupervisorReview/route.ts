// src/app/api/saveSupervisorReview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
      nextReviewDate,
    } = body;

    // Validate required fields
    if (!supervisorName || !employeeName || !reviewDate || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: supervisorName, employeeName, reviewDate, and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating (1-5)
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('supervisor_reviews')
      .insert({
        supervisor_name: supervisorName,
        employee_name: employeeName,
        review_date: reviewDate,
        rating,
        comments: comments || '',
        department: department || '',
        strengths: strengths || '',
        areas_for_improvement: areasForImprovement || '',
        goals: goals || '',
        next_review_date: nextReviewDate || '',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving supervisor review to Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to save supervisor review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supervisor review saved successfully',
      reviewId: data?.id,
    });
  } catch (error) {
    console.error('Error saving supervisor review:', error);
    return NextResponse.json(
      { error: 'Failed to save supervisor review' },
      { status: 500 }
    );
  }
}