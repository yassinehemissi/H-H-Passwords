import ButtonsWrapper from "@/components/home/ButtonsWrapper";
import Keys from "@/lib/encryption/client/Keys";

export default function Home() {
  return (
    <main className="flex justify-center flex-col items-center text-white w-full h-fit min-h-screen text-center">
      <h1 className="text-[4rem] font-bold">H&H</h1>
      <h2 className="text-[1.7rem] translate-y-[-20px] font-light">
        Passwords
      </h2>
      <p className="text-[1.2rem]">
        The best solution to store your passwords based on your preferences
      </p>
      <ButtonsWrapper />
    </main>
  );
}
