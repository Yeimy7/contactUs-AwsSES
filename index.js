const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const ses = new SESClient();

module.exports.createContact = async (event, context) => {
  console.log("Received:::", event);
  const { to, from, subject, message } = JSON.parse(event.body);

  if (!to || !from || !subject || !message) {
    return {
      headers: {
        "Content-Type": "applicaton/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 400,
      body: JSON.stringify({ message: "to or from... are not set properties" }),
    };
  }
  console.log("El subject ->", subject);
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: { Data: message },
      },
      Subject: { Data: subject },
    },
    Source: from,
  };
  try {
    await ses.send(new SendEmailCommand(params));
    return {
      headers: {
        "Content-Type": "applicaton/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 200,
      body: JSON.stringify({
        message: "email sent successfully!",
        success: true,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      headers: {
        "Content-Type": "applicaton/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 400,
      body: JSON.stringify({
        message: "The email failed to send",
        success: false,
      }),
    };
  }
};
