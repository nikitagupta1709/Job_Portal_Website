import nodemailer from "nodemailer"; // Importing the nodemailer package for sending emails

// Function to send a confirmation email to an applicant after they apply for a job
export const sendMail = async (applicantEmail, jobTitle, companyName) => {
  // Create a transporter object using Gmail service for sending emails
  const transporter = nodemailer.createTransport({
    service: "gmail", // Specify the email service to use (Gmail in this case)
    auth: {
      user: "nikitagupta1709@gmail.com", // Sender's email address
      pass: "gsvj dwti psjk ghwp", // Password or app-specific password for the sender's email
    },
  });

  // Set up email options, including recipient, subject, and message body
  const mailOptions = {
    from: "nikitagupta1709@gmail.com", // Sender's email address
    to: applicantEmail, // Recipient's email address (applicant's email)
    subject: `Application Confirmation for ${jobTitle}`, // Email subject line
    text: `Dear Applicant,\n\nThank you for applying for the position of ${jobTitle} at ${companyName}. We have received your application.\n\nBest regards,\n${companyName}`, // Email body text
  };

  // Try to send the email using the transporter
  try {
    await transporter.sendMail(mailOptions); // Send the email with the specified options
    console.log("Email sent successfully"); // Log success message to the console
  } catch (error) {
    // Catch any errors that occur during email sending
    console.error("Error sending email:", error); // Log the error to the console
  }
};
