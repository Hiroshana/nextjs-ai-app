"use client";

import { useState } from "react";
import { fa } from "zod/locales";

const CompletionPage = () => {
  const [prompt, setPrompt] = useState(""); // user input
  const [completion, setCompletion] = useState(""); // AI response
  const [isLoading, setIsLoading] = useState(false); // loading flag
  const [error, setError] = useState<string | null>(null);

  const complete = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setPrompt("");

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setCompletion(data.text);
    } catch (error) {
      console.log("Error", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : completion ? (
        <div className="whitespace-pre-wrap">{completion}</div>
      ) : null}

      <form
        onSubmit={complete}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            placeholder="How can I help you?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompletionPage;
