import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { redis, cacheKey } from "@/lib/redis";
import type { Explanation, ExplainRequest, ApiResponse } from "@/lib/types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

async function callOpenAI(topic: string, level: string): Promise<string> {
  if (!openai) throw new Error("OpenAI client not configured");

  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_tokens: 4096,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(topic, level as "beginner" | "intermediate" | "advanced") },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("No response from OpenAI");
  return text;
}

async function callAnthropic(topic: string, level: string): Promise<string> {
  if (!anthropic) throw new Error("Anthropic client not configured");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6-20250627",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      { role: "user", content: buildUserPrompt(topic, level as "beginner" | "intermediate" | "advanced") },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Anthropic");
  }
  return textBlock.text;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ExplainRequest;
    const { topic, level } = body;

    if (!topic || !level) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing topic or level" },
        { status: 400 }
      );
    }

    if (!["beginner", "intermediate", "advanced"].includes(level)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid level" },
        { status: 400 }
      );
    }

    // Check cache
    if (redis) {
      const cached = await redis.get<Explanation>(cacheKey(topic, level));
      if (cached) {
        return NextResponse.json<ApiResponse>({ success: true, data: cached });
      }
    }

    // Primary: OpenAI GPT-5.4 Mini | Fallback: Anthropic Claude Sonnet 4.6
    let rawText: string;
    let openaiError: unknown = null;

    if (openai) {
      try {
        rawText = await callOpenAI(topic, level);
      } catch (err) {
        openaiError = err;
        console.warn("OpenAI call failed:", err);
      }
    }

    if (!rawText! && anthropic) {
      try {
        rawText = await callAnthropic(topic, level);
      } catch (err) {
        console.warn("Anthropic fallback also failed:", err);
        const primaryMsg = openaiError instanceof Error ? openaiError.message : "OpenAI unavailable";
        const fallbackMsg = err instanceof Error ? err.message : "Anthropic unavailable";
        return NextResponse.json<ApiResponse>(
          { success: false, error: `Both providers failed. Primary: ${primaryMsg}. Fallback: ${fallbackMsg}` },
          { status: 502 }
        );
      }
    }

    if (!rawText!) {
      if (!openai && !anthropic) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "No AI provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY." },
          { status: 503 }
        );
      }
      const reason = openaiError instanceof Error ? openaiError.message : "OpenAI call failed";
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Primary provider failed: ${reason}. No fallback configured — set ANTHROPIC_API_KEY to enable fallback.` },
        { status: 502 }
      );
    }

    const explanation: Explanation = JSON.parse(rawText);

    // Cache for 24 hours
    if (redis) {
      await redis.set(cacheKey(topic, level), JSON.stringify(explanation), {
        ex: 86400,
      });
    }

    return NextResponse.json<ApiResponse>({ success: true, data: explanation });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
