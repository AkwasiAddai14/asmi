import { Providers } from "@/app/providers";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
 <Providers>
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="flex items-center justify-center w-full">
          <SignIn path="/sign-in" />
        </div>
      </div>
      </Providers>
    </>
  );
}