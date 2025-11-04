export async function GET() {
  await new Promise(r => setTimeout(r, 100)); // simulate 100 ms delay
  return Response.json({ ok: true });
}
