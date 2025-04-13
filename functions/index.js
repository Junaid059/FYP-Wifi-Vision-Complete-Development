const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendAccountEmail = functions.https.onCall(async (data, context) => {
  const {userEmail, userPassword} = data;

  const msg = {
    to: userEmail,
    from: "junaidkhalid2001@gmail.com", // this must be verified on SendGrid
    subject: "Your WiFi Access and Account is Ready",
    html: `
      <h3>Welcome Admin WIVI here!</h3>
      <p>Welcome to WIVI</p>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p><strong>Password:</strong> ${userPassword}</p>
      <p>You can now log in to your dashboard.</p>
    `,
  };

  try {
    await sgMail.send(msg);
    return {success: true};
  } catch (error) {
    return {success: false, error: error.message};
  }
});
