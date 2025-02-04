import { Navbar } from "@/components/layout/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex flex-col w-full">
            <Navbar />
            <div className="max-w-[1200px] w-full mx-auto p-4">
                {children}
            </div>
        </main>
    );
}