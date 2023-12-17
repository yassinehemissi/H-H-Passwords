"use client";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>([]);
  const [text, setText] = useState("");

  const [text2, setText2] = useState("");
  return (
    <main className="flex justify-center flex-col items-center text-white w-full h-fit min-h-screen text-center">
      <textarea
        onChange={(e) => {
          setText(e.target.value);
          try {
            setData(JSON.parse(text));
          } catch (e) {}
        }}
        style={{ width: 500, height: 200 }}
      ></textarea>
      <input
        type="text"
        value={text2}
        onChange={(e) => {
          setText2(e.target.value);
        }}
      />
      {data ? (
        data.map((e: any) => {
          if (e.name.includes(text2))
            return (
              <>
                <p>Name: {e.name}</p>
                <p>Age: {e.age}</p>
              </>
            );
          else null;
        })
      ) : (
        <p></p>
      )}
    </main>
  );
}
