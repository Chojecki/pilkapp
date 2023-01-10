import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "../../utils/email-service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only post request allowed" });
  }
  try {
    const { name, gameName, adminEmail } = req.body;

    //send email to admin
    const emailSubject = `${name} wypisał się z meczu: ${gameName}}`;

    const emailBody = `${name} wypisał się z meczu: ${gameName}}`;
    const emailParam = {
      to: adminEmail as string,
      from: process.env.ADMIN_EMAIL as string,
      subject: emailSubject,
      text: emailBody,
    };

    sendEmail(emailParam);

    return res.status(200).json({ message: "Contact Email Sent Successfully" });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ message: errorMessage });
  }
}
