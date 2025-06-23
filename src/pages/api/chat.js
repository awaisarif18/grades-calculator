import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEW_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // or 'gpt-4o', 'gpt-3.5-turbo', etc.
      messages: messages, // your [{ role, content }] array
      store: true, // optional: saves to your OpenAI history
    });

    const reply = completion.choices[0].message;
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI request failed:", err);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
}
