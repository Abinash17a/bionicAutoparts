// src/app/api/saveSubmission/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import nodemailer from 'nodemailer';

function generateCustomId(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function getNextSubmissionTarget(): Promise<string> {
  try {
    // Try RPC function first
    const { data: rpcTarget, error: rpcError } = await supabaseAdmin.rpc('get_next_submission_target');
    if (!rpcError && rpcTarget) {
      return rpcTarget;
    }

    // Fallback if RPC is not loaded yet
    const { data: counterData } = await supabaseAdmin
      .from('submission_counters')
      .select('count')
      .eq('id', 'submissionCounter')
      .single();

    const currentCount = (counterData?.count || 0) + 1;

    await supabaseAdmin
      .from('submission_counters')
      .upsert({ id: 'submissionCounter', count: currentCount });

    return currentCount % 10 <= 2 ? 'submissions_v2' : 'submissions';
  } catch (error) {
    console.error('Error determining target table:', error);
    return 'submissions';
  }
}

async function sendEmail(
  name: string,
  contact: string,
  email: string,
  zipCode: string,
  searchedPartFormatted: string,
  orderId: string,
  targetCollection: string
) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.warn('Skipping email notification: EMAIL_USER or EMAIL_APP_PASSWORD not set');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const recipientEmail = 'part@usausedautopart.com';
    const subjectPrefix =
      targetCollection === 'submissions'
        ? 'New Submission Notification'
        : 'Exclusive New Submission Notification';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `${subjectPrefix} ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #007BFF; text-align: center;">${subjectPrefix}</h2>
          <p style="font-size: 16px;">Kindly review and assist in confirming the availability and pricing of the requested part. Let’s ensure we respond promptly to the customer:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Name:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Contact:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${contact}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Email:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Zip Code:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${zipCode}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Part:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${searchedPartFormatted}</td>
            </tr>
          </table>
          <p style="font-size: 14px; color: #555;">This is an automated notification. If you have any questions, please contact support.</p>
          <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #888;">
            &copy; ${new Date().getFullYear()} Bionic Auto Parts. All rights reserved.
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error: any) {
    console.error('Error sending email:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, contact, email, zipCode, searchedPartFormatted } = await req.json();

    let orderId: string | null = null;

    if (contact) {
      // Check existing submissions in v1
      const { data: existingV1 } = await supabaseAdmin
        .from('submissions')
        .select('order_id')
        .eq('contact', contact)
        .limit(1);

      if (existingV1 && existingV1.length > 0) {
        orderId = existingV1[0].order_id;
      } else {
        // Check existing submissions in v2
        const { data: existingV2 } = await supabaseAdmin
          .from('submissions_v2')
          .select('order_id')
          .eq('contact', contact)
          .limit(1);

        if (existingV2 && existingV2.length > 0) {
          orderId = existingV2[0].order_id;
        }
      }
    }

    if (!orderId) {
      orderId = generateCustomId(6);
    }

    const targetTable = await getNextSubmissionTarget();

    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from(targetTable)
      .insert({
        order_id: orderId,
        name: name || '',
        contact: contact || '',
        email: email || '',
        zip_code: zipCode || '',
        searched_part_formatted: searchedPartFormatted || '',
        status: 'Pending',
      })
      .select('id')
      .single();

    if (insertError) {
      console.error(`Error inserting into ${targetTable}:`, insertError);
      return NextResponse.json({ error: 'Error saving data' }, { status: 500 });
    }

    // Send email notification asynchronously
    sendEmail(name, contact, email, zipCode, searchedPartFormatted, orderId, targetTable).catch((err) =>
      console.error('Background email failed:', err)
    );

    const response = NextResponse.json({
      message: `Data saved successfully in ${targetTable}!`,
      id: insertedData?.id,
      orderId,
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json({ error: 'Error saving data' }, { status: 500 });
  }
}
