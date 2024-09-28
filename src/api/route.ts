import Replicate from 'replicate';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const output = await replicate.run(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      {
        input: {
          prompt: "A TOK emoji of " + prompt,
          apply_watermark: false,
        },
      }
    );

    return new Response(JSON.stringify({ output }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating emoji:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate emoji' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
