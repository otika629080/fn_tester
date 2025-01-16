"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase client setup
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key must be provided.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const VALID_USERNAME = "nag-tester";
const VALID_PASSWORD = "qC(gUG4RRk%a";

export default function TestFunctionPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cycleId, setCycleId] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const logMessage = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const handleLogin = () => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid username or password.");
    }
  };

  const callTestFunction = async () => {
    try {
      logMessage("Preparing to call testfunction...");
      const { data, error } = await supabase.rpc("testfunction", {
        cycle_id: cycleId,
        unit_id: unitId,
      });

      if (error) {
        logMessage(`Error: ${error.message}`);
        setError(error.message);
        setResult(null);
      } else {
        logMessage(`Function executed successfully. Result: ${JSON.stringify(data)}`);
        setResult(data);
        setError(null);
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      logMessage(`Unexpected error: ${errorMessage}`);
      setError(errorMessage);
      setResult(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow rounded-lg p-8 w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center font-sans">
      <h1 className="text-3xl font-bold text-center mb-8">Call Test Function</h1>

      {/* Input for cycle_id */}
      <div className="w-full max-w-md mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Cycle ID</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={cycleId}
          onChange={(e) => setCycleId(e.target.value)}
          placeholder="Enter cycle ID"
        />
      </div>

      {/* Input for unit_id */}
      <div className="w-full max-w-md mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Unit ID</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={unitId}
          onChange={(e) => setUnitId(e.target.value)}
          placeholder="Enter unit ID"
        />
      </div>

      {/* Execute Button */}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={callTestFunction}
      >
        Execute Function
      </button>

      {/* Logs */}
      <div className="w-full max-w-md mt-6">
        <h2 className="text-lg font-medium mb-4">Logs</h2>
        <div className="bg-gray-100 p-4 rounded shadow overflow-auto h-64">
          {logs.map((log, index) => (
            <p key={index} className="text-sm text-gray-800">
              {log}
            </p>
          ))}
        </div>
      </div>

      {/* Results or Error */}
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      {result && (
        <pre className="bg-gray-100 text-sm p-4 rounded w-full mt-4 overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
