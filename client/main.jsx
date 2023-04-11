import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // Example data to send to the webhook
  const data = {
    message: 'Hello from MeteorJS',
    timestamp: new Date(),
  };

  // Call the server-side method to send the webhook
  Meteor.call('sendWebhook', data, (error, response) => {
    if (error) {
      console.error('Error sending webhook:', error);
    } else {
      console.log('Webhook sent successfully:', response);
    }
  });
});
