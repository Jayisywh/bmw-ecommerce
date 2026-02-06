import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_GMAIL_USER,
        pass: process.env.APP_GMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.APP_GMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Email send successfully");
  } catch (err) {
    console.log(err);
  }
};
