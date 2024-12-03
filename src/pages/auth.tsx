// import { Center, HStack, VStack } from "@chakra-ui/react";
// import Head from "next/head";
// import { HelloUserMessage } from "@/components/Messages/HelloUserMessage";
// import { LogoutButton } from "@/components/Buttons/LogOutButton";
// import { ItemTableButton } from "@/components/Buttons/ItemTableButton";

// export default function Auth() {
//   return (
//     <>
//       <Head>
//         <title>Memo App</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <Center h="100vh">
//         <VStack>
//           <HelloUserMessage />
//           <LogoutButton />
//           <ItemTableButton />
//         </VStack>
//       </Center>
//     </>
//   );
// }


// // src/pages/auth.tsx
// import { Center, VStack, Button, Heading } from "@chakra-ui/react";
// import Head from "next/head";
// import { useRouter } from "next/router";
// import supabase from "@/libs/supabase";

// export default function Auth() {
//   const router = useRouter();

//   const GitHubSignIn = async () => {
//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "github",
//       });
//       if (error) throw error;

//       console.log("GitHubログイン成功");
//     } catch (error) {
//       console.error("ログインエラー:", error);
//       alert("ログインに失敗しました。もう一度お試しください。");
//     }
//   };

//   return (
//     <>
//       <Head>
//         <title>ログイン</title>
//       </Head>
//       <Center h="100vh">
//         <VStack spacing={4}>
//           <Heading>メモ帳</Heading>
//           <Button colorScheme="teal" onClick={GitHubSignIn}>
//             ログイン
//           </Button>
//         </VStack>
//       </Center>
//     </>
//   );
// }


// // /home/jaymin/pbl_next_jay/src/pages/auth.tsx

// import { useEffect, useState } from "react";
// import { Center, VStack, Button, Heading } from "@chakra-ui/react";
// import Head from "next/head";
// import supabase from "@/libs/supabase";
// import { useRouter } from "next/router";
// import { useRecoilState } from "recoil";

// // /home/jaymin/pbl_next_jay/src/libs/states.ts
// import { Session } from "@supabase/supabase-js";
// import { atom } from "recoil";

// export const sessionState = atom<Session | null>({
//   key: "sessionState", // 一意のキー
//   default: null, // 初期値
// });



// export default function Auth() {
//   const router = useRouter();
//   // 使用箇所
// const [session, setSession] = useRecoilState(sessionState);


//   // セッション情報の取得
//   useEffect(() => {
//     const checkSession = async () => {
//       const { data } = await supabase.auth.getSession();
//       setSession(data?.session ?? null);
//     };
//     checkSession();
//   }, []);

//   const GitHubSignIn = async () => {
//     if (session) {
//       // サインイン済みの場合
//       router.replace("/loading");
//       setTimeout(() => {
//         router.replace("/book");
//       }, 2000); // 2秒遅延
//     } else {
//       // サインインしていない場合
//       try {
//         const { error } = await supabase.auth.signInWithOAuth({
//           provider: "github",
//         });
//         if (error) throw error;
//         // OAuth 認証が開始され、ユーザーは GitHub のログインページへリダイレクトされます
//       } catch (error) {
//         console.error("ログインエラー:", error);
//         alert("ログインに失敗しました。もう一度お試しください。");
//       }
//     }
//   };

//   return (
//     <>
//       <Head>
//         <title>ログイン</title>
//       </Head>
//       <Center h="100vh">
//         <VStack spacing={4}>
//           <Heading>メモ帳</Heading>
//           <Button colorScheme="teal" onClick={GitHubSignIn}>
//             ログイン
//           </Button>
//         </VStack>
//       </Center>
//     </>
//   );
// }

// /home/jaymin/pbl_next_jay/src/pages/auth.tsx

import { useEffect } from "react";
import { Center, VStack, Button, Heading,Box } from "@chakra-ui/react";
import Head from "next/head";
import supabase from "@/libs/supabase";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { sessionState } from "@/libs/states";

export default function Auth() {
  const router = useRouter();
  const [session, setSession] = useRecoilState(sessionState);

  // セッション情報の取得
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
    };
    checkSession();
  }, [setSession]);

  const GitHubSignIn = async () => {
    try {
      // セッションを再チェック
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        console.log("サインイン済み: /loading に遷移");
        router.replace("/loading");
        setTimeout(() => {
          router.replace("/book");
        }, 2000); // 2秒遅延
      } else {
        console.log("サインイン未確認: GitHub 認証を開始");
        // サインインしていない場合は、認証を開始
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "github",
        });
        if (error) throw error;
        // 注意: 未サインイン時はリダイレクトを行わない
        // GitHubの認証画面に遷移するため、ここで処理は終了
      }
    } catch (error) {
      console.error("ログインエラー:", error);
      alert("ログインに失敗しました。もう一度お試しください。");
    }
  };

  return (
    <>
      <Head>
        <title>ログイン</title>
      </Head>
      <Box p={4}>
        <VStack spacing={4} align="center">
          <Heading>メモ帳</Heading>
          <Button colorScheme="teal" onClick={GitHubSignIn}>
            ログイン
          </Button>
        </VStack>
      </Box>
    </>
  );
}
