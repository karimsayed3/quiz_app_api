import nodemailer from "nodemailer";
import ProjectError from "../helper/error";

const sendEmail = async (
  email: string,
  subject: string,
  text: string
): Promise<any> => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const emailSent = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
  } catch (error) {
    const err = new ProjectError("email not sent");
    // const err2 = new ProjectError(err);
    err.statusCode = 401;
    console.log(error);
    throw err;
  }
};

export default sendEmail;
