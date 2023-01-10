import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only post request allowed" });
  }
  try {
    const { name, gameName, adminEmail, nextInLine, isPlayerNameOnBench } =
      req.body;

    //send email to admin
    const emailSubject = `Gracz wypisał się z meczu: ${gameName}`;

    const emailBody = `${name} wypisał się z meczu: ${gameName}`;

    let nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: process.env.NEXT_PUBLIC_NOTI_ADMIN_EMAIL,
        pass: process.env.NEXT_PUBLIC_NOTIF_PASS,
      },
      secure: true,
      authentication: "plain",
    });
    const mailData = {
      from: process.env.NEXT_PUBLIC_NOTI_ADMIN_EMAIL,
      to: adminEmail as string,
      subject: emailSubject,
      text: emailBody,
      html: `<div style="font-size: 24px;"><span style="font-weight: bold;">${name}</span> wypisał się z meczu: <span style="font-weight: bold;">${gameName}</span></div>
      <p style="font-size: 18px;">${
        isPlayerNameOnBench === "true"
          ? "Był na rezerwie więc luz :)"
          : nextInLine === "brak"
          ? "Nie ma nikogo na rezerwie :("
          : `Następny w kolejce jest: <span style="font-weight: bold;">${nextInLine}</span> daj mu cynk, że gra!`
      }</p>
      <p>Nie odpowiadaj na tę wiadomość. Jest to wiadomość automatyczna.</p>`,
    };
    // @ts-ignore
    await transporter.sendMail(mailData, function (err, info) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: err });
      } else console.log(info);
    });
    res.status(200);

    return res.status(200).json({ message: "Contact Email Sent Successfully" });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ message: errorMessage });
  }
}
