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
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    // Get the raw response text
    let responseText = response.content[0].text;
    
    // Convert Claude 4's **Speaker:** format to Speaker: format (simple replacement)
    responseText = responseText.replaceAll('**Professor Hartwell:**', 'Professor Hartwell:');
    responseText = responseText.replaceAll('**Blake:**', 'Blake:');
    responseText = responseText.replaceAll('**Drew:**', 'Drew:');
    responseText = responseText.replaceAll('**Casey:**', 'Casey:');
    responseText = responseText.replaceAll('**Avery:**', 'Avery:');
    
    // Remove quotes at the start of speaker text
    responseText = responseText.replace(/(Professor Hartwell|Blake|Drew|Casey|Avery): "/gm, '$1: ');

    return Response.json({
      response: responseText,
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Failed to get response from Claude' },
      { status: 500 }
    );
  }
}