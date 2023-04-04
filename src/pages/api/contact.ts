import { NextApiRequest, NextApiResponse } from "next";
import { GetUserResponse } from "./userSession";
import nodemailer from "nodemailer";

export interface ContactRequest{
    contactingUser: GetUserResponse,
    contactedUserEmail: string,
    message: string
}

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const request: ContactRequest = await JSON.parse(req.body);

    const contactingUserFullName = `${request.contactingUser.firstName} ${request.contactingUser.lastName}`
  
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_ADDRESS}"`, // sender address
      to: request.contactedUserEmail, // list of receivers
      subject: `SciRen-Net Contact Request from ${contactingUserFullName}`, // Subject line
      text: `            
                Contact request from ${contactingUserFullName} on SciRen-Net
                Message:
                ${request.message}
                To respond to the message, please email ${contactingUserFullName} at ${request.contactingUser.email}
                `, // plain text body
      html: `
                <h1>Contact request from ${contactingUserFullName} on SciRen-Net</h1>
                <h2>Message:<h2>
                <p>${request.message}</p>
                <h2>To respond to the message, please email ${contactingUserFullName} at ${request.contactingUser.email}</h2>
            `,
    });

    console.log("Message sent: %s", info.messageId);
    return res.status(200).json({contacted: true})
}
