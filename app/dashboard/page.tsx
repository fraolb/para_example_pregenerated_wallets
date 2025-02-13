"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ParaModal, OAuthMethod, WalletType } from "@getpara/react-sdk";
import para from "../../para";
import "@getpara/react-sdk/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [twitterHandle, setTwitterHandle] = useState("");
  const [wallets, setWallets] = useState<{ handle: string; wallet: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Ensure the user is logged in
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await para.getUserId();
        if (!user) {
          router.push("/");
        }
      } catch (error) {
        console.error("Login check error:", error);
        router.push("/");
      }
    };
    checkLogin();
  }, [router]);

  // Handle pregen wallet check and creation
  const handlePregenWallet = async (userIdentifier: string) => {
    console.log("the userIdentifier is ", userIdentifier);
    try {
      const hasWallet = await para.hasPregenWallet({
        pregenIdentifier: userIdentifier,
        pregenIdentifierType: OAuthMethod.TWITTER,
      });
      console.log("user wallet ", hasWallet);
      if (!hasWallet) {
        const pregenWallet = await para.createPregenWallet({
          type: WalletType.EVM,
          pregenIdentifier: userIdentifier,
          pregenIdentifierType: OAuthMethod.TWITTER,
        });
        console.log("New pregenerated wallet created:", pregenWallet.id);
        return pregenWallet.id;
      } else {
        console.log("Pregenerated wallet already exists for this user");
        return null;
      }
    } catch (error) {
      console.error("Error handling pregenerated wallet:", error);
      return null;
    }
  };

  // Generate wallet using Para
  const handleAddWallet = async () => {
    if (!twitterHandle.trim()) return;
    setLoading(true);

    try {
      const walletId = await handlePregenWallet(twitterHandle);
      if (walletId) {
        setWallets((prev) => [
          ...prev,
          { handle: twitterHandle, wallet: walletId },
        ]);
      }
      setTwitterHandle("");
    } catch (error) {
      console.error("Error generating wallet:", error);
    }
    setLoading(false);
  };

  return (
    <QueryClientProvider client={new QueryClient()}>
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
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

        {/* Form for adding a Twitter pre-generated wallet */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Add Pregenerated Twitter Wallet
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              placeholder="Enter Twitter handle"
              className="border p-2 rounded w-full"
            />
            <button
              onClick={handleAddWallet}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Generating..." : "Add Wallet"}
            </button>
          </div>
        </div>

        {/* Display generated wallets */}
        {wallets.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Generated Wallets</h2>
            <ul className="border p-4 rounded">
              {wallets.map((wallet, index) => (
                <li key={index} className="mb-2">
                  <span className="font-medium">@{wallet.handle}</span>:{" "}
                  <span className="text-gray-600">{wallet.wallet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
};

export default Dashboard;
