"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ParaModal, OAuthMethod } from "@getpara/react-sdk";
import para from "../para";
import "@getpara/react-sdk/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Handle login event
  const handleLogin = async () => {
    try {
      const user = await para.getUserId();
      if (user) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div>
            <button onClick={() => setIsOpen(true)}>
              Sign in with Twitter
            </button>
            <ParaModal
              para={para}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              logo={""}
              theme={{}}
              oAuthMethods={[OAuthMethod.TWITTER]}
              disableEmailLogin
              disablePhoneLogin
              authLayout={["AUTH:FULL", "EXTERNAL:FULL"]}
              externalWallets={[]}
              recoverySecretStepEnabled
              onRampTestMode={true}
            />
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
