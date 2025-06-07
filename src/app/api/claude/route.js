import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Debug lines to check if API key is loading
console.log('API Key loaded:', process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No');
console.log('API Key starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 10));

export async function POST(request) {
  try {
    const { message } = await request.json();

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    return Response.json({
      response: response.content[0].text,
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Failed to get response from Claude' },
      { status: 500 }
    );
  }
}