import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { studentQuestion, assignmentContext, gradeLevel } = await req.json();

    const systemInstruction = `
      You are an encouraging, patient educational AI tutor for a ${gradeLevel || 'Middle School'} student on SchoolPulse.
      CRITICAL RULE: NEVER give direct answers or write complete solutions to homework prompts.
      Use the Socratic method: break down the concept, ask guided questions, and prompt the student to think.
      Keep tone positive, age-appropriate, and concise.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `Assignment Context: ${assignmentContext || 'General Homework Help'}` }] },
        { role: 'user', parts: [{ text: `Student Question: ${studentQuestion}` }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 350,
      }
    });

    return NextResponse.json({ success: true, reply: response.text });
  } catch (error) {
    console.error('AI Tutor API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate guidance.' },
      { status: 500 }
    );
  }
}