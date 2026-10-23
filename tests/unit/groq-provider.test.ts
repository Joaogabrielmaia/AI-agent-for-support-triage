import { afterEach, describe, expect, it, vi } from "vitest";
import { GroqProvider, ProviderError, providerFromEnv } from "@/lib/agent/providers";

afterEach(() => vi.unstubAllGlobals());

const req = { question: "Quanto custa?", history: [], sources: [{ articleSlug: "a", title: "Planos", chunkId: "a#0", heading: "h", snippet: "O plano custa R$ 119.", score: 0.5 }] };

describe("GroqProvider", () => {
  it("monta a requisição e lê texto e uso de tokens", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: "R$ 119 [1]" } }], usage: { prompt_tokens: 50, completion_tokens: 7 } }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const out = await new GroqProvider("chave-falsa").answer(req);
    expect(out).toEqual({ text: "R$ 119 [1]", usage: { inputTokens: 50, outputTokens: 7 } });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("api.groq.com");
    expect(init.headers.authorization).toBe("Bearer chave-falsa");
    expect(JSON.parse(init.body).messages[1].content).toContain("<pergunta>Quanto custa?</pergunta>");
  });

  it("erro HTTP, resposta vazia e falha de rede viram ProviderError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 429 })));
    await expect(new GroqProvider("k", undefined, 0).answer(req)).rejects.toBeInstanceOf(ProviderError);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: "" } }] }), { status: 200 })));
    await expect(new GroqProvider("k").answer(req)).rejects.toBeInstanceOf(ProviderError);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(new GroqProvider("k").answer(req)).rejects.toBeInstanceOf(ProviderError);
  });

  it("tenta de novo depois de um 429 e então responde", async () => {
    vi.useFakeTimers();
    const ok = new Response(JSON.stringify({ choices: [{ message: { content: "ok" } }] }), { status: 200 });
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response("{}", { status: 429, headers: { "retry-after": "2" } })).mockResolvedValueOnce(ok);
    vi.stubGlobal("fetch", fetchMock);
    const pending = new GroqProvider("k").answer(req);
    await vi.advanceTimersByTimeAsync(3000);
    expect((await pending).text).toBe("ok");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("exige chave e é escolhido por LLM_PROVIDER=groq", () => {
    expect(() => new GroqProvider("")).toThrow(ProviderError);
    expect(providerFromEnv({ LLM_PROVIDER: "groq", GROQ_API_KEY: "k" } as unknown as NodeJS.ProcessEnv).name).toBe("groq:openai/gpt-oss-120b");
  });
});
