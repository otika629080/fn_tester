"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase Client Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key must be provided.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Dummy login credentials
const VALID_USERNAME = "nag-tester";
const VALID_PASSWORD = "qC(gUG4RRk%a";

export default function SupabaseApiTester() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [endpoint, setEndpoint] = useState<string>("");
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE">("GET");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: "Content-Type", value: "application/json" },
  ]);
  const [body, setBody] = useState<string>("{}");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleHeaderChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addHeaderInput = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const callApi = async () => {
    try {
      setError(null);
      setResponse(null);

      // Convert headers to the required format { [key: string]: string }
      const requestHeaders = headers.reduce((acc, header) => {
        if (header.key && header.value) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {} as { [key: string]: string });

      const options = {
        headers: requestHeaders,
      };

      if (method !== "GET" && body) {
        (options as any).body = JSON.parse(body);
      }

      // Call Supabase function
      const { data, error } = await supabase.functions.invoke(endpoint, options);

      if (error) {
        throw new Error(error.message);
      }

      setResponse(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleLogin = () => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid username or password.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow rounded-lg p-8 w-96">
          <h2 className="text-2xl font-bold text-center mb-4">ログイン</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">ユーザー名</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザー名を入力してください"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">パスワード</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力してください"
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
            onClick={handleLogin}
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center font-sans">
      <h1 className="text-3xl font-bold text-center mb-8">Supabase API テスター</h1>

      {/* 使い方 */}
      <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-4 mb-6 max-w-md">
        <h2 className="text-lg font-bold mb-2">使い方</h2>
        <ol className="list-decimal list-inside text-sm space-y-2">
          <li>テストしたいSupabaseエンドポイント名を入力してください。</li>
          <li>HTTPメソッド（GET, POST, PUT, DELETE）を選択してください。</li>
          <li>必要に応じてヘッダーを追加してください（例: Content-Type）。</li>
          <li>必要であれば、リクエストボディをJSON形式で入力してください。</li>
          <li>「Execute API Call」をクリックしてリクエストを送信してください。</li>
          <li>レスポンスやエラーの詳細が下に表示されます。</li>
        </ol>
      </div>

      {/* Endpoint Input */}
      <div className="w-full max-w-md mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">エンドポイント</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="エンドポイント名を入力してください"
        />
      </div>

      {/* Method Selector */}
      <div className="w-full max-w-md mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">HTTPメソッド</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={method}
          onChange={(e) => setMethod(e.target.value as "GET" | "POST" | "PUT" | "DELETE")}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      {/* Headers Input */}
      <div className="w-full max-w-md mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Headers</label>
        {headers.map((header, index) => (
          <div key={index} className="flex items-center mb-2 gap-2">
            <input
              type="text"
              className="w-1/3 px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Key"
              value={header.key}
              onChange={(e) => handleHeaderChange(index, "key", e.target.value)}
            />
            <input
              type="text"
              className="w-2/3 px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Value"
              value={header.value}
              onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
            />
          </div>
        ))}
        <button
          className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-4 rounded"
          onClick={addHeaderInput}
        >
          + Add Header
        </button>
      </div>

      {/* Body Input */}
      {method !== "GET" && (
        <div className="w-full max-w-md mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="リクエストボディをJSON形式で入力してください"
          ></textarea>
        </div>
      )}

      {/* Execute Button */}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={callApi}
      >
        Execute API Call
      </button>

      {/* Results or Error */}
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      {response && (
        <pre className="bg-gray-100 text-sm p-4 rounded w-full mt-4 overflow-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
