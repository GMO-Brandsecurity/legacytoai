"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738S0 4.935 0 10.304c0 4.814 4.27 8.846 10.035 9.608.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967C23.02 14.455 24 12.499 24 10.304z" fill="#06C755"/>
      <path d="M19.365 12.792H16.94a.326.326 0 0 1-.326-.326V8.429a.326.326 0 0 1 .326-.326h2.425a.326.326 0 0 1 .326.326v.653a.326.326 0 0 1-.326.326h-1.446v.632h1.446a.326.326 0 0 1 .326.326v.653a.326.326 0 0 1-.326.326h-1.446v.632h1.446a.326.326 0 0 1 .326.326v.653a.326.326 0 0 1-.326.326zm-5.088 0a.326.326 0 0 1-.326-.326V8.429a.326.326 0 0 1 .326-.326h.653a.326.326 0 0 1 .326.326v4.037a.326.326 0 0 1-.326.326h-.653zm-2.183 0a.326.326 0 0 1-.326-.326V8.429a.326.326 0 0 1 .326-.326h.653a.326.326 0 0 1 .326.326v.653a.326.326 0 0 1-.326.326h-.327v.632h.327a.326.326 0 0 1 .326.326v.653a.326.326 0 0 1-.326.326h-.327v.632h.327a.326.326 0 0 1 .326.326v.653a.326.326 0 0 1-.326.326h-.653zm-4.252 0a.326.326 0 0 1-.326-.326V8.429a.326.326 0 0 1 .326-.326h.653a.326.326 0 0 1 .29.177l1.615 2.694V8.429a.326.326 0 0 1 .326-.326h.653a.326.326 0 0 1 .326.326v4.037a.326.326 0 0 1-.326.326h-.653a.326.326 0 0 1-.29-.177L8.495 9.921v2.545a.326.326 0 0 1-.326.326h-.653z" fill="#fff"/>
    </svg>
  );
}

export default function SocialLoginButtons() {
  const { loginWithSocial, isSupabase } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (!isSupabase) return null;

  const handleSocial = async (provider: "google" | "line") => {
    setError("");
    setLoadingProvider(provider);
    const result = await loginWithSocial(provider);
    if (!result.success) {
      setError(result.error || "ログインに失敗しました");
      setLoadingProvider(null);
    }
    // On success, the browser redirects to the OAuth provider
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-400">または</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocial("google")}
          disabled={!!loadingProvider}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {loadingProvider === "google" ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Google
        </button>
        <button
          type="button"
          onClick={() => handleSocial("line")}
          disabled={!!loadingProvider}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {loadingProvider === "line" ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <LineIcon />
          )}
          LINE
        </button>
      </div>
    </div>
  );
}
