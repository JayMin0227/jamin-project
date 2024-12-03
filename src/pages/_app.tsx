

// import { ChakraProvider } from "@chakra-ui/react";
// import { RecoilRoot } from "recoil";
// import type { AppProps } from "next/app";
// import { SessionProvider } from "@/providers/SessionProvider"; // インポート

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <RecoilRoot>
//       <SessionProvider> {/* SessionProviderで全体をラップ */}
//         <ChakraProvider>
//           <Component {...pageProps} />
//         </ChakraProvider>
//       </SessionProvider>
//     </RecoilRoot>
//   );
// }

// export default MyApp;

import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";
import { SessionProvider } from "@/providers/SessionProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <SessionProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionProvider>
    </RecoilRoot>
  );
}

export default MyApp;



