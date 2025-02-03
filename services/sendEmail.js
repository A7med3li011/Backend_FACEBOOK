import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";
export function sender(email, code) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: { name: "meta", email: "afafg804@gmail.com" }, // Use the email address or domain you verified above
    subject: "Sending From Facebook Agency",
    text: "and easy to do anywhere, even with Node.js",
    html: `<h1>your verification code is ${code}</h1>`,
  };
  sgMail.send(msg).then(
    (res) => {
      console.log("sendDone");
    },
    (error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
}
