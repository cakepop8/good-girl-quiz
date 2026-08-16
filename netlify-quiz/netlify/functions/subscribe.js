exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { email, first_name, archetype } = JSON.parse(event.body);

    const url = `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUB_ID}/subscriptions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
      },
      body: JSON.stringify({
        email,
        first_name,
        reactivate_existing: true,
        send_welcome_email: false,
        tags: ['Archetype Quiz'],
        custom_fields: [{ name: 'Good Girl Archetype', value: archetype }]
      })
    });

    const data = await response.json();
    console.log('Beehiiv status:', response.status);
    console.log('Beehiiv response:', JSON.stringify(data));

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, data }) };
  } catch (err) {
    console.log('Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
