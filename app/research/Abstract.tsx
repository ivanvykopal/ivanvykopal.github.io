"use client";
import { useState } from "react";

export default function Abstract({ abstract }: { abstract: string }) {
    const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col">
      <span className="mt-4 p-0 font-semibold">Abstract:</span>

      {visible && (
        <p className="text-base mt-2 mb-0 pb-0">
          {abstract}
        </p>
      )}

      <button
        className="text-blue-600 text-sm mt-2 self-start hover:underline"
        onClick={() => setVisible(!visible)}
      >
        {visible ? "Hide abstract" : "Show abstract"}
      </button>
    </div>
  );
}
