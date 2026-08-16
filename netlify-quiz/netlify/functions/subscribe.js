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

    const response = await fetch(
      'https://api.beehiiv.com/v2/publications/pub_569dd26f-3789-412d-950f-e5179aa49e78/subscriptions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 9JHx3UScDnAOv5pXyfPiPtXIXsTtJOrn0ItSxIUJkRUU53aDQnK49DmDy80rm6Vp'
        },
        body: JSON.stringify({
          email,
          first_name,
          reactivate_existing: true,
          send_welcome_email: false,
          custom_fields: [{ name: 'archetype', value: archetype }]
        })
      }
    );

    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, data }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
