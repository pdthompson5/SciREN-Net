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
    console.log(process.env.EMAIL_PASSWORD)

    const contactingUserFullName = `${request.contactingUser.firstName} ${request.contactingUser.lastName}`
    console.log(request.contactedUserEmail)
  
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_ADDRESS}"`, // sender address
      to: request.contactedUserEmail, // list of receivers
      subject: `SciRen-Net Contact Request from ${contactingUserFullName}`, // Subject line
      text: `This is the message: ${request.message}`, // plain text body
      html: "<b>Hello world?</b>", // html body
    });


    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


    return res.status(200).json({contacted: true})

}
