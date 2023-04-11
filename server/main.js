import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { HTTP } from 'meteor/http';


// Parse the METEOR_SETTINGS JSON string
const meteorSettings = JSON.parse(process.env.METEOR_SETTINGS);

// Access the OPENAI_API_KEY from the parsed object
const OPENAI_API_KEY = meteorSettings.OPENAI_API_KEY;


console.log('OPENAI_API_KEY:', OPENAI_API_KEY);


const callChatGPT = async (prompt) => {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await HTTP.call('POST', apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      data: {
        prompt,
        max_tokens: 50,
        n: 1,
        stop: null,
        temperature: 1,
      },
    });

    if (response && response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].text.trim();
    } else {
      throw new Error('Invalid response from ChatGPT API');
    }
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    throw new Error('Failed to fetch response from ChatGPT API');
  }
};

Meteor.startup(() => {

console.log('OPENAI_API_KEY:', OPENAI_API_KEY);

  WebApp.connectHandlers.use('/post-endpoint', async (req, res, next) => {
    if (req.method === 'POST') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        console.log('Received POST data:', body);

        // Call the ChatGPT API with the received data as the prompt
        try {
          const chatGptResponse = await callChatGPT(body);
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(chatGptResponse);
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error fetching response from ChatGPT API');
        }
      });
    } else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
    }
  });
});
