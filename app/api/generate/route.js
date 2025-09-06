export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    return Response.json({
      text: `Simulated AI reply for: ${prompt}`
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
