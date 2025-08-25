import Image from "next/image";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <span className="text-center text-lg text-white">
        Welcome to the interview assessment. Visit <a href="/robot" className="underline text-blue-400 hover:text-blue-600">/robot</a> to view the robot simulation.
      </span>
    </main>
  );
}
