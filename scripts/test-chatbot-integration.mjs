async function run() {
  const port = process.env.BOT_PORT || 8000;
  const baseUrl = `http://localhost:${port}`;
  const sessionId = 'test-session-' + Date.now();
  
  console.log(`Testing Tony Beta 3 API against ${baseUrl}...`);
  console.log('--- 1. First Message ---');
  let res = await fetch(`${baseUrl}/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'origin': 'http://localhost:3000' },
    body: JSON.stringify({ session_id: sessionId, message: "I need a driver's side mirror for my 2015 Ford F150." })
  });
  let json = await res.json();
  console.log('Status:', res.status);
  console.log('CORS Allow Origin:', res.headers.get('access-control-allow-origin'));
  console.log('Bot Reply:', json.reply);
  console.log('Context:', JSON.stringify(json.context, null, 2));

  console.log('\n--- 2. Follow-up Message (Side Correction) ---');
  res = await fetch(`${baseUrl}/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message: 'Actually I need the passenger side.' })
  });
  json = await res.json();
  console.log('Bot Reply:', json.reply);
  console.log('Context:', JSON.stringify(json.context, null, 2));

  console.log('\n--- 3. Follow-up Message (Location update) ---');
  res = await fetch(`${baseUrl}/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message: 'My car is a 2015 F150 and I moved to Chicago.' })
  });
  json = await res.json();
  console.log('Bot Reply:', json.reply);
  console.log('Context:', JSON.stringify(json.context, null, 2));

  console.log('\n--- 4. Civic Query ---');
  const civicSession = 'civic-session-' + Date.now();
  res = await fetch(`${baseUrl}/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ session_id: civicSession, message: 'My 2012 Civic got hit yesterday and the front light broke.' })
  });
  json = await res.json();
  console.log('Civic Reply:', json.reply);
  console.log('Civic Context:', JSON.stringify(json.context, null, 2));

  console.log('\n--- 5. Reset Session ---');
  res = await fetch(`${baseUrl}/reset-session`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId })
  });
  json = await res.json();
  console.log('Reset Response:', json);
}

run().catch(console.error);
