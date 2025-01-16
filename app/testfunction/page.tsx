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

export default function TestFunctionPage() {
  const [cycleId, setCycleId] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const callTestFunction = async () => {
    try {
      const { data, error } = await supabase.rpc("testfunction", {
        cycle_id: cycleId,
        unit_id: unitId,
      });

      if (error) {
        setError(error.message);
        setResult(null);
        console.error("Error calling testfunction:", error.message);
      } else {
        setResult(data);
        setError(null);
        console.log("Function result:", data);
      }
    } catch (err) {
      setError((err as Error).message);
      setResult(null);
      console.error("Unexpected error:", err);
    }
  };

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
