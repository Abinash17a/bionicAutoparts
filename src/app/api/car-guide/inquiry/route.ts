import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';
import { validateVinFormat } from '@/lib/nhtsa/nhtsaService';
import { waitUntil } from '@vercel/functions';

function generateOrderId(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendNotificationEmail(params: {
  orderId: string;
  name: string;
  email: string;
  phone: string;
  zipCode?: string;
  requestedPart: string;
  message?: string;
  vin: string;
  vehicleYear?: string | number;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleTrim?: string;
  vehicleEngine?: string;
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    return;
  }

  try {
    // Reuse transporter for better performance
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const vehicleSummary = `${params.vehicleYear || ''} ${params.vehicleMake || ''} ${params.vehicleModel || ''} ${params.vehicleTrim || ''}`.trim() || 'Vehicle Details Attached';

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'part@usausedautopart.com',
      subject: `New VIN Parts Inquiry: ${params.orderId} (${vehicleSummary})`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4338CA; text-align: center; margin-bottom: 20px;">New VIN Parts Inquiry (${params.orderId})</h2>
          <p style="font-size: 15px;">A customer has requested a parts inquiry directly through the Vehicle Guide VIN Decoder:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd; width: 35%;">Order ID:</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-family: monospace;">${params.orderId}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Customer Name:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.name}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Email:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.email}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Phone:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.phone}</td>
            </tr>
            ${params.zipCode ? `
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">ZIP Code:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.zipCode}</td>
            </tr>` : ''}
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Part Requested:</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #1E40AF;">${params.requestedPart}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">17-Digit VIN:</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-family: monospace; font-weight: bold;">${params.vin}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Decoded Vehicle:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${vehicleSummary}</td>
            </tr>
            ${params.vehicleEngine ? `
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Engine Specs:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.vehicleEngine}</td>
            </tr>` : ''}
            ${params.message ? `
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Additional Details:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.message}</td>
            </tr>` : ''}
          </table>
          <p style="font-size: 13px; color: #666; margin-top: 20px;">Source: Bionic Auto Parts Free US Vehicle Guide (/car-guide)</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending VIN inquiry notification email:', error);
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      zipCode,
      requestedPart,
      message,
      vin,
      vehicleYear,
      vehicleMake,
      vehicleModel,
      vehicleTrim,
      vehicleEngine,
    } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide a valid full name.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Phone validation: allow digits, spaces, hyphens, parentheses, plus sign; require at least 7 digits
    const digitsOnly = typeof phone === 'string' ? phone.replace(/\D/g, '') : '';
    if (!phone || typeof phone !== 'string' || digitsOnly.length < 7) {
      return NextResponse.json(
        { error: 'Please provide a valid phone number (at least 7 digits).' },
        { status: 400 }
      );
    }

    // ZIP Code validation (US 5-digit or ZIP+4) - optional but validated if provided
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (zipCode && typeof zipCode === 'string' && zipCode.trim() && !zipRegex.test(zipCode.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid 5-digit ZIP code (or ZIP+4 format).' },
        { status: 400 }
      );
    }

    if (!requestedPart || typeof requestedPart !== 'string' || requestedPart.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please specify the auto part you need.' },
        { status: 400 }
      );
    }

    if (!vin || typeof vin !== 'string') {
      return NextResponse.json(
        { error: 'A 17-character VIN is required for this inquiry.' },
        { status: 400 }
      );
    }

    const vinCheck = validateVinFormat(vin);
    if (!vinCheck.isValidFormat) {
      return NextResponse.json(
        { error: vinCheck.error || 'Invalid 17-character VIN format.' },
        { status: 400 }
      );
    }

    const cleanVin = vinCheck.cleanVin;
    const orderId = generateOrderId();

    const vehicleSummary = `${vehicleYear || ''} ${vehicleMake || ''} ${vehicleModel || ''}`.trim();
    const searchedPartFormatted = `${vehicleSummary ? `${vehicleSummary} - ` : ''}${requestedPart.trim()} (VIN: ${cleanVin})${message?.trim() ? ` Notes: ${message.trim()}` : ''}`;

    const submissionDoc = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      zipCode: zipCode ? zipCode.trim() : '',
      contact: phone.trim(), // for legacy dashboard queries
      requestedPart: requestedPart.trim(),
      part: requestedPart.trim(),
      message: message?.trim() || '',
      vin: cleanVin,
      vehicleYear: vehicleYear ? String(vehicleYear).trim() : '',
      vehicleMake: vehicleMake ? String(vehicleMake).trim() : '',
      vehicleModel: vehicleModel ? String(vehicleModel).trim() : '',
      vehicleTrim: vehicleTrim ? String(vehicleTrim).trim() : '',
      vehicleEngine: vehicleEngine ? String(vehicleEngine).trim() : '',
      searchedPartFormatted,
      source: 'car-guide-vin-inquiry',
      status: 'Pending',
      orderId,
      createdAt: new Date(),
    };

    const targetRef = collection(db, 'submissions');
    const docRef = await addDoc(targetRef, submissionDoc);

    const dbDuration = Date.now() - startTime;
    console.log(`[PERF] VIN inquiry DB write: ${dbDuration}ms, orderId: ${orderId}`);

    // Attempt email notification in background using waitUntil (Vercel-supported)
    // This ensures the email is sent even after the response is returned
    waitUntil(
      sendNotificationEmail({
        orderId,
        name: submissionDoc.name,
        email: submissionDoc.email,
        phone: submissionDoc.phone,
        zipCode: submissionDoc.zipCode,
        requestedPart: submissionDoc.requestedPart,
        message: submissionDoc.message,
        vin: cleanVin,
        vehicleYear: submissionDoc.vehicleYear,
        vehicleMake: submissionDoc.vehicleMake,
        vehicleModel: submissionDoc.vehicleModel,
        vehicleTrim: submissionDoc.vehicleTrim,
        vehicleEngine: submissionDoc.vehicleEngine,
      }).catch((e) => console.error('Background email failed:', e))
    );

    const totalDuration = Date.now() - startTime;
    console.log(`[PERF] VIN inquiry total: ${totalDuration}ms, orderId: ${orderId}`);

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        orderId,
        message: 'Your parts inquiry has been submitted successfully!',
        vehicle: {
          year: submissionDoc.vehicleYear,
          make: submissionDoc.vehicleMake,
          model: submissionDoc.vehicleModel,
          vin: cleanVin,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const totalDuration = Date.now() - startTime;
    console.error(`[PERF] VIN inquiry failed after ${totalDuration}ms:`, error);
    const message = error instanceof Error ? error.message : 'Failed to save parts inquiry.';
    return NextResponse.json(
      { error: 'An unexpected error occurred while saving your inquiry. Please try again.', details: message },
      { status: 500 }
    );
  }
}
