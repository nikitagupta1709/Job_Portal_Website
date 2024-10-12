// src/utils/mailer.js
import nodemailer from "nodemailer";

export const sendMail = async (applicantEmail, jobTitle, companyName) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your mail service
    auth: {
      user: "nikitagupta1709@gmail.com",
      pass: "gsvj dwti psjk ghwp",
    },
  });

  const mailOptions = {
    from: "nikitagupta1709@gmail.com",
    to: applicantEmail,
    subject: `Application Confirmation for ${jobTitle}`,
    text: `Dear Applicant,\n\nThank you for applying for the position of ${jobTitle} at ${companyName}. We have received your application.\n\nBest regards,\n${companyName}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
