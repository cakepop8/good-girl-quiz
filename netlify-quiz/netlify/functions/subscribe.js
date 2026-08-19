const AUTOMATION_IDS = {
  'THE COOL GIRL': 'c4cdb636-bf29-4fde-82c8-6a369f6c87f3',
  'THE FORTRESS': '27efd4d1-8e22-4e3e-944d-14603c818474',
  'THE GOLD STAR GIRL': '11aca65b-bd88-4a26-b689-e6b5d00b284b',
  'THE HIDDEN ARTIST': '1e4f287c-a49c-4dfc-af58-ef0de29cbe87',
  'THE LADY-IN-WAITING': '73f14b1c-fa9d-4e14-b682-253ff0253cf3',
  'THE LOLLIPOP LADY': 'ae1f51b6-0a0e-4ce7-be03-3e17f0a8ba91',
  'THE MILESTONE MAKER': '177a0df1-3e29-45a4-af51-58aa5ffa5246',
  'THE PERFECTIONISTA': '636ccf90-8b5a-405f-9592-517a7a195229',
  'THE RUMINATOR': 'eda7f0ac-bb17-45f5-a488-c454e8c60d41',
  'THE SAINT': '4a9668f1-89da-4a92-892b-e320071c953a',
  'THE SHAPESHIFTER': '6562b8c0-48bb-4a3b-acbc-ea7ec86276a4',
  'THE WELLNESS GURU': '420ae4fc-2054-4a28-9249-f7605a0c8752'
};

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
    const automationId = AUTOMATION_IDS[archetype];

    console.log('Subscribing:', email, first_name, archetype, automationId);

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
        automation_ids: automationId ? [automationId] : [],
        tags: ['good girl quiz'],
        custom_fields: [
          { name: 'Good Girl Archetype', value: archetype },
          { name: 'First Name', value: first_name }
        ]
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
