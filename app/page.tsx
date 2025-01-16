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

export default function HelloWorldApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [functionName, setFunctionName] = useState<string>("");
  const [params, setParams] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParamChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const addParamInput = () => {
    setParams([...params, { key: "", value: "" }]);
  };

  const logMessage = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const callFunction = async () => {
    try {
      logMessage("Preparing arguments...");
      const args = params.reduce((acc, param) => {
        if (param.key && param.value) {
          acc[param.key] = isNaN(Number(param.value)) ? param.value : Number(param.value);
        }
        return acc;
      }, {} as Record<string, any>);

      logMessage(`Arguments prepared: ${JSON.stringify(args)}`);
      logMessage(`Calling function: ${functionName}`);

      const { data, error } = await supabase.rpc(functionName, args);

      if (error) {
        logMessage(`Error occurred: ${error.message}`);
        throw error;
      }

      logMessage("Function executed successfully.");
      setResult(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setResult(null);
      logMessage(`Error: ${(err as Error).message}`);
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
      <h1 className="text-3xl font-bold text-center mb-8">Supabase Function Executor</h1>

      {/* Function Name Input */}
      <div className="w-full max-w-md mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Function Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          placeholder="Enter function name"
        />
      </div>

      {/* Params Inputs */}
      <div className="w-full max-w-md mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Parameters</label>
        {params.map((param, index) => (
          <div key={index} className="flex items-center mb-2 gap-2">
            <input
              type="text"
              className="w-1/3 px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Key"
              value={param.key}
              onChange={(e) => handleParamChange(index, "key", e.target.value)}
            />
            <input
              type="text"
              className="w-2/3 px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Value"
              value={param.value}
              onChange={(e) => handleParamChange(index, "value", e.target.value)}
            />
          </div>
        ))}
        <button
          className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-4 rounded"
          onClick={addParamInput}
        >
          + Add Param
        </button>
      </div>

      {/* Execute Button */}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={callFunction}
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
