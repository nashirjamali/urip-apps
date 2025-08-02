import { defaultConfig } from "@xellar/kit";
import { sepolia } from "viem/chains";
import { Config } from "wagmi";

const walletConnectProjectId = "ea054384ce1e0b3b3e78f0cf0891ca6d";
const xellarAppId = "e205e069-b986-400e-b496-e46dc81993a9";

export const config = defaultConfig({
  appName: "Urip",
  walletConnectProjectId,
  xellarAppId,
  xellarEnv: "sandbox",
  chains: [sepolia],
  ssr: true
}) as Config;