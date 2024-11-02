import nodemailer from 'nodemailer';

export async function POST(req:any) {
  const { name, email, message } = await req.json();

  
  let transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  let mailOptions = {
    from: `"${name}" <${email}>`, 
    to: 'testuser7@gmail.com', 
    subject: 'New Contact Form Submission',
    text: `You have a new message from ${name} (${email}): \n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true, message: 'Message sent successfully!' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Failed to send message', error }), { status: 500 });
  }
}
