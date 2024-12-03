// import { Session } from "@supabase/supabase-js";
// import { usePathname } from "next/navigation";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { useRecoilState } from "recoil";

// import { sessionState } from "@/libs/states";
// import supabase from "@/libs/supabase";

// type SessionProviderProps = {
//   children: React.ReactNode;
// };

// export const SessionProvider = ({ children }: SessionProviderProps) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isReady, setIsReady] = useState(false);
//   const [, setSession] = useRecoilState<Session | null>(sessionState);

//   useEffect(() => {
//     const sessionUpdate = async () => {
//       const {
//         data: { session },
//         error,
//       } = await supabase.auth.getSession();
//       console.log("取得したセッション:", session); // ここでセッション情報をログ出力

      
//       if (error) {
//         console.error(error);
//         setIsReady(false);
//         return;
//       }
//       setSession(session);
//       if (session) {
//         if (pathname === "/") {
//           router.replace("/auth");
//           return;
//         }
//         setIsReady(true);
//         return;
//       }
//       if (pathname !== "/") {
//         router.replace("/");
//         return;
//       }
//       setIsReady(true);
//       return;
//     };

//     sessionUpdate();
//   }, [router, pathname, setIsReady, setSession]);

//   if (!isReady) {
//     return <></>;
//   }
//   return <>{children}</>;
// };



// // /home/jaymin/pbl_next_jay/src/providers/SessionProvider.tsx
// import { Session } from "@supabase/supabase-js";
// import { useEffect, useState } from "react";
// import { useRecoilState } from "recoil";
// import supabase from "@/libs/supabase";
// import { sessionState } from "@/libs/states";
// import { useRouter } from "next/router";

// type SessionProviderProps = {
//   children: React.ReactNode;
// };

// export const SessionProvider = ({ children }: SessionProviderProps) => {
//   const [, setSession] = useRecoilState(sessionState); // セッションを Recoil の状態管理に設定

// export const SessionProvider = ({ children }: SessionProviderProps) => {
//   const router = useRouter();
//   const [session, setSession] = useRecoilState<Session | null>(sessionState); // セッションのRecoil状態を管理
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     const checkSession = async () => {
//       const { data, error } = await supabase.auth.getSession();
//       if (error) {
//         console.error("セッション取得エラー:", error);
//         return;
//       }
//       setSession(data.session); // セッションを設定
//       setIsReady(true);
//     };

//     checkSession();
//   }, [setSession]);

//     // 未認証なら /auth にリダイレクト
//   useEffect(() => {
//     if (isReady && !session && router.pathname !== "/auth") {
//       router.replace("/auth");
//     }
//   }, [isReady, session, router]);

//   if (!isReady) return null; // セッションチェック中は何もレンダリングしない
//   return <>{children}</>;
// };



// // src/providers/SessionProvider.tsx
// import { Session } from "@supabase/supabase-js";
// import { useEffect, useState } from "react";
// import { useRecoilState } from "recoil";
// import { useRouter } from "next/router";
// import supabase from "@/libs/supabase";
// import { sessionState } from "@/libs/states";

// type SessionProviderProps = {
//   children: React.ReactNode;
// };

// export const SessionProvider = ({ children }: SessionProviderProps) => {
//   const router = useRouter();
//   const pathname = router.pathname;
//   const [session, setSession] = useRecoilState<Session | null>(sessionState);
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     const fetchSession = async () => {
//       const { data, error } = await supabase.auth.getSession();
//       console.log("セッションデータ:", data);
//       console.log("エラー:", error);
//       setSession(data?.session ?? null);
//       setIsReady(true);
//     };
  
//     fetchSession();
//   }, [setSession]);
  
//   useEffect(() => {
//     console.log("isReady:", isReady);
//     console.log("session:", session);
//     console.log("現在のパス:", router.pathname);
  
//     if (isReady) {
//       if (!session && router.pathname !== "/auth") {
//         console.log("未認証: /auth にリダイレクト");
//         router.replace("/auth");
//       } else if (session && router.pathname === "/auth") {
//         console.log("認証済み: /book にリダイレクト");
//         router.replace("/book");
//       }
//     }
//   }, [isReady, session, router]);
  

//   if (!isReady) {
//     return null; // セッション状態が未確認なら何も表示しない
//   }

//   return <>{children}</>;
// };

// /home/jaymin/pbl_next_jay/src/providers/SessionProvider.tsx

// import { Session } from "@supabase/supabase-js";
// import { useEffect, useState } from "react";
// import { useRecoilState } from "recoil";
// import { useRouter } from "next/router";
// import supabase from "@/libs/supabase";
// import { sessionState } from "@/libs/states";

// type SessionProviderProps = {
//   children: React.ReactNode;
// };

// export const SessionProvider = ({ children }: SessionProviderProps) => {
//   const router = useRouter();
//   const pathname = router.pathname;
//   const [session, setSession] = useRecoilState<Session | null>(sessionState);
//   const [isSessionChecked, setIsSessionChecked] = useState(false); // セッション確認完了フラグ

//   // セッション情報の取得と認証状態リスナー設定
//   useEffect(() => {
//     const fetchSession = async () => {
//       const { data } = await supabase.auth.getSession();
//       setSession(data?.session ?? null);
//       setIsSessionChecked(true);
//     };

//     fetchSession();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [setSession]);

//   // 認証状態に応じたページ遷移
//   useEffect(() => {
//     if (isSessionChecked) {
//       if (!session && pathname !== "/auth") {
//         router.replace("/auth"); // 未認証状態は /auth へ
//       }
//       // サインイン済みでも /auth から自動的にリダイレクトしない
//     }
//   }, [isSessionChecked, session, pathname, router]);


//   return <>{children}</>;
// };



// /home/jaymin/pbl_next_jay/src/providers/SessionProvider.tsx

// import { Session } from "@supabase/supabase-js";
// import { useEffect, useState } from "react";
// import { useRecoilState } from "recoil";
// import { useRouter } from "next/router";
// import supabase from "@/libs/supabase";
// import { sessionState } from "@/libs/states";

// type SessionProviderProps = {
//   children: React.ReactNode;
// };

// export const SessionProvider = ({ children }: SessionProviderProps) => {
//   const router = useRouter();
//   const pathname = router.pathname;
//   const [session, setSession] = useRecoilState<Session | null>(sessionState);
//   const [isSessionChecked, setIsSessionChecked] = useState(false);

//   // セッション情報の取得
//   useEffect(() => {
//     const fetchSession = async () => {
//       const { data } = await supabase.auth.getSession();
//       setSession(data?.session ?? null);
//       setIsSessionChecked(true);
//     };

//     fetchSession();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [setSession]);

//   // ページ遷移の制御
//   useEffect(() => {
//     if (!isSessionChecked) return;

//     if (!session) {
//       // 未認証ユーザー: 必ず /auth に遷移
//       if (pathname !== "/auth") {
//         router.replace("/auth");
//       }
//     } else if (pathname === "/auth") {
//       // サインイン済みユーザー: /auth にいる場合のみ /loading → /book
//       router.replace("/loading");
//       setTimeout(() => {
//         router.replace("/book");
//       }, 2000);
//     } else {
//       // サインイン済みで他のページでは何もしない
//     }
//   }, [isSessionChecked, session, pathname, router]);

//   return <>{children}</>;
// };




import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import supabase from "@/libs/supabase";
import { sessionState } from "@/libs/states";

type SessionProviderProps = {
  children: React.ReactNode;
};

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const router = useRouter();
  const pathname = router.pathname;
  const [session, setSession] = useRecoilState<Session | null>(sessionState);
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  // セッション情報の取得
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
      setIsSessionChecked(true);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession]);
  useEffect(() => {
    if (!isSessionChecked) return;
  
    if (!session) {
      // 未認証ユーザー: 必ず /auth に遷移
      if (pathname !== "/auth") {
        console.log("未認証ユーザー: /auth にリダイレクト");
        router.replace("/auth");
      }
    } else {
      // 認証済みユーザー: 常に /loading を経由して /book に遷移
      if (pathname !== "/loading" && pathname !== "/book") {
        console.log("認証済みユーザー: /loading にリダイレクト");
        router.replace("/loading");
        setTimeout(() => {
          router.replace("/book");
        }, 2000); // 2秒遅延
      }
    }
  }, [isSessionChecked, session, pathname, router]);
  

  // // ページ遷移の制御
  // useEffect(() => {
  //   if (!isSessionChecked) return;

  //   if (!session) {
  //     // 未認証ユーザー：/auth 以外のページでは /auth にリダイレクト
  //     if (pathname !== "/auth") {
  //       router.replace("/auth");
  //     }
  //   } 
    
    
    
    
    
    
    
  //   else {
  //     // 認証済みユーザー：/auth または /loading にいる場合は /book にリダイレクト
  //     if (pathname === "/auth" || pathname === "/loading") {
  //       router.replace("/book");
  //     }
  //   }
  // }, [isSessionChecked, session, pathname, router]);

  return <>{children}</>;
};
