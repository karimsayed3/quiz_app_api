import nodemailer from "nodemailer";
import ProjectError from "../helper/error";

const sendEmail = async (
  email: string,
  subject: string,
  text: string
): Promise<any> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abokhadiga6@gmail.com",
        pass: "mwrlpngtlbcadnam",
      },
    });

    const emailSent = await transporter.sendMail({
      from: "abokhadiga6@gmail.com",
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
