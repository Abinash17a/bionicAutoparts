import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
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

async function getCounterValue() {
  const counterRef = doc(db, 'counters', 'submissionCounter');
  try {
    const counterDoc = await getDoc(counterRef);
    if (!counterDoc.exists()) {
      await setDoc(counterRef, { count: 0 });
      return 0;
    }
    return counterDoc.data().count;
  } catch (error) {
    console.error("Error retrieving counter:", error);
    throw error;
  }
}

async function updateCounter(counterValue: any) {
  const counterRef = doc(db, 'counters', 'submissionCounter');
  try {
    await updateDoc(counterRef, { count: counterValue });
  } catch (error) {
    console.error("Error updating counter:", error);
    throw error;
  }
}
let targetCollection: string ='';
async function getRandomCollection(): Promise<string> {
  try {
    let counter = await getCounterValue();
    counter++;

    const collection = counter % 10 <= 2 ? 'submissionsv2' : 'submissions';
    targetCollection = collection;
    console.log("Target collection updated to:", targetCollection);

    await updateCounter(counter);

    return collection;
  } catch (error) {
    console.error("Error determining the target collection:", error);
    throw error;
  }
}
console.log("target collection is",targetCollection);
async function sendEmail(
  name: string,
  contact: string,
  email: string,
  zipCode: string,
  searchedPartFormatted: string,
  orderId: string,
  targetCollection: string
) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
      debug: true,
      logger: true,
    });

    const getMailOptions = (target: string) => {
      if (target === undefined) {
        throw new Error("Target collection is undefined. Cannot proceed with mail options.");
      }

      const recipientEmail =
        target === 'submissions'
          ? 'johnsmith.row52@gmail.com'
          : 'kintonny540@gmail.com';

      const subjectPrefix =
        target === 'submissions'
          ? 'New Submission Notification'
          : 'Exclusive New Submission Notification';

      return {
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
              &copy; ${new Date().getFullYear()} American Dismantling. All rights reserved.
            </footer>
          </div>
        `,
      };
    };
    console.log("target collection is in before mail",targetCollection);


    const mailOptions = getMailOptions(targetCollection);

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error: any) {
    console.error('Error sending email:', error);

    // Add more error context if available
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }

    if (error.code) {
      console.error('Error Code:', error.code);
    }
  }
}

export async function POST(req: NextRequest) {
  const { name, contact, email, zipCode, searchedPartFormatted } = await req.json();

  try {
    const submissionsRef = collection(db, 'submissions');
    const submissionsV2Ref = collection(db, 'submissionsv2');

    const querySubmissions = query(submissionsRef, where('contact', '==', contact));
    const submissionsSnapshot = await getDocs(querySubmissions);

    const querySubmissionsV2 = query(submissionsV2Ref, where('contact', '==', contact));
    const submissionsV2Snapshot = await getDocs(querySubmissionsV2);

    let orderId: string;

    if (!submissionsSnapshot.empty) {
      orderId = submissionsSnapshot.docs[0].data().orderId;
    } else if (!submissionsV2Snapshot.empty) {
      orderId = submissionsV2Snapshot.docs[0].data().orderId;
    } else {
      orderId = generateCustomId(6);
    }

    const targetCollection = await getRandomCollection();
    const targetRef = collection(db, targetCollection);

    const docRef = await addDoc(targetRef, {
      name,
      contact,
      email,
      zipCode,
      searchedPartFormatted,
      createdAt: new Date(),
      status: 'Pending',
      orderId,
    });

    // Send email notification
    if(targetCollection === 'submissions') {
    await sendEmail(name, contact, email, zipCode,searchedPartFormatted,orderId,targetCollection);
    }
    if(targetCollection === 'submissionsv2') {
      await sendEmail(name, contact, email, zipCode,searchedPartFormatted,orderId,targetCollection);
      }
    const response = NextResponse.json({
      message: `Data saved successfully in ${targetCollection}!`,
      id: docRef.id,
      orderId,
    });

    response.headers.set('Access-Control-Allow-Origin', 'https://www.bionicsautoparts.com');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error adding document: ', error);
    return NextResponse.json({ error: 'Error saving data' }, { status: 500 });
  }
}
