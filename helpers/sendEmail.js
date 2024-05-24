import "dotenv/config";
import sgMail from '@sendgrid/mail';

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (data) => {
    const email = {...data, from: "ostapcuk@ua.fm"};
    await sgMail.send(email);
    return true;
}


