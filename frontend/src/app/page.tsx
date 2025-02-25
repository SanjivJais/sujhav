import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center gap-4 p-24">
      <h1 className="text-3xl font-extrabold">SUJHAV<span className="text-primary font-bold text-4xl">.</span></h1>
      <div className="flex flex-col items-center gap-2 absolute top-[40%]">
        <h2 className="text-2xl font-semibold max-w-[400px] text-center">AI-powered platform for crowdsourcing issues, ideas, and suggestions!</h2>
        <p className="italic text-muted-foreground my-4">Let&apos;s Solve Nepal Together</p>
        <Link href="/auth/login"><Button variant={"default"}>Login</Button></Link>
      </div>
    </main>
  );
}
