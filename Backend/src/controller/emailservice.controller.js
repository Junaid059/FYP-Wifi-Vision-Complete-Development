import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();   

const transporter=nodemailer.createTransport({  
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:process.env.SENDEREMAIL,
        pass:process.env.AUTHENTICATIONCODE,
    }
});

const sendEmail = async(req, res) => {
    try {
        const { username, email, phone } = req.body;
        if(!username || !email || !phone) {
            return res.status(400).json({error:'Please fill all the fields'});
        }

        const mailOptions = {
            from: `"WiVi" <noreply.info@wifivision.com>`,
            to: email,
            subject: "We've Received Your Details",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Thank You for Contacting WIVI</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                        <tr>
                            <td align="center" bgcolor="#3498db" style="padding: 30px 0;">
                                <h1 style="color: #ffffff; margin: 0; font-weight: 600; letter-spacing: 1px;">WIVI</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="color: #2c3e50; margin-top: 0; margin-bottom: 20px; font-weight: 600;">Thank You for Contacting Us</h2>
                                
                                <p style="color: #34495e; font-size: 16px; line-height: 24px; margin-bottom: 15px;">Hello <span style="font-weight: bold;">${username}</span>,</p>
                                
                                <p style="color: #34495e; font-size: 16px; line-height: 24px; margin-bottom: 15px;">We have successfully received your details and information. Our team will review your submission and get back to you as soon as possible.</p>
                                
                                <div style="background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin: 25px 0; border-radius: 4px;">
                                    <p style="color: #34495e; font-size: 16px; line-height: 24px; margin: 0;">
                                        <strong>Contact Information:</strong><br>
                                        Name: ${username} <br>
                                        Email: ${email} <br>
                                        Phone: ${phone}
                                    </p>
                                </div>
                                
                                <p style="color: #34495e; font-size: 16px; line-height: 24px; margin-bottom: 15px;">Thank you for your patience and interest in our services.</p>
                                
                                <p style="color: #34495e; font-size: 16px; line-height: 24px; margin-top: 30px; margin-bottom: 5px;">Best regards,</p>
                                <p style="color: #34495e; font-size: 16px; line-height: 24px; font-weight: 600; margin-top: 0;">The WIVI Support Team</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" bgcolor="#f1f1f1" style="padding: 20px 30px;">
                                <p style="color: #7f8c8d; font-size: 14px; margin: 0;">© 2025 WIVI. All rights reserved.</p>
                                <p style="color: #7f8c8d; font-size: 12px; margin-top: 10px;">
                                    If you didn't request this email, please disregard it.
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return res.status(200).json({message:'Email sent successfully'});
    }
    catch(err) {
        console.log(err);
        return res.status(400).json({error:err.message});   
    }
};

const sendDetailsEmail=async (req, res) => {
    try{
        const {username, email, password} = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({error:'Please fill all the fields'});
        }
        const mailOptions = {
            from: `"WiVi" <noreply.info@wifivision.com>`,
            to: email,
            subject: "Your WiVi Account Has Been Created",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Your WiVi Account Details</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                        <tr>
                            <td align="center" bgcolor="#3498db" style="padding: 30px 0;">
                                <h1 style="color: #ffffff; margin: 0; font-weight: 600; letter-spacing: 1px;">WiVi</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="color: #2c3e50; margin-top: 0; margin-bottom: 20px; font-weight: 600;">Your Account Credentials</h2>
                                
                                <p style="color: #34495e; font-size: 16px; line-height: 24px; margin-bottom: 15px;">Hello <span style="font-weight: bold;">${username}</span>,</p>
                                
                                <p style="color: #34495e; font-size: 16px; line-height: 24px; margin-bottom: 15px;">Your WiVi account has been created successfully. Below are your login credentials:</p>
                                
                                <div style="background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin: 25px 0; border-radius: 4px;">
                                    <p style="color: #34495e; font-size: 16px; line-height: 24px; margin: 0;">
                                        <strong>Login Details:</strong><br>
                                        Username: ${username}<br>
                                        Password: ${password}
                                    </p>
                                </div>
                                
                                <p style="color: #34495e; font-size: 16px; line-height: 24px; margin-bottom: 25px;">To access your account, please visit our login page:</p>
                                
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="http://localhost:5173/login" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Login to Your Account</a>
                                </div>
                                
                                <p style="color: #34495e; font-size: 16px; line-height: 24px; margin-bottom: 15px;">For security reasons, we recommend changing your password after your first login.</p>
                                
                                <p style="color: #34495e; font-size: 16px; line-height: 24px; margin-top: 30px; margin-bottom: 5px;">Best regards,</p>
                                <p style="color: #34495e; font-size: 16px; line-height: 24px; font-weight: 600; margin-top: 0;">The WiVi Support Team</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" bgcolor="#f1f1f1" style="padding: 20px 30px;">
                                <p style="color: #7f8c8d; font-size: 14px; margin: 0;">© 2025 WiVi. All rights reserved.</p>
                                <p style="color: #7f8c8d; font-size: 12px; margin-top: 10px;">
                                    This email contains sensitive information. Please do not share it with others.
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return res.status(200).json({message:'Email sent successfully'});
    }
    catch(err){
        console.log(err);
        return res.status(400).json({error:err.message});
    }
};

export { sendEmail, sendDetailsEmail };


