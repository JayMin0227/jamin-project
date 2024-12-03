



// import { Button, Box } from "@chakra-ui/react";
// import { useRouter } from "next/router";
// import supabase from "@/libs/supabase";

// export function LogoutButton() {
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       await supabase.auth.signOut();
//       console.log("ログアウト完了");
//       router.replace("/auth"); // ログアウト後にリダイレクト
//     } catch (error) {
//       console.error("ログアウトエラー:", error);
//       alert("ログアウトに失敗しました。");
//     }
//   };

//   return (
//     <Box
//       position="fixed" // スクロールしても固定
//       top="1rem" // 上端から1rem
//       right="1rem" // 右端から1rem
//       zIndex="1000" // 高い優先度で表示
//       bg="white" // 背景色を白に設定
//       boxShadow="lg" // 影を追加
//       borderRadius="md" // ボタン周りに丸みを追加
//       p="1" // 余白を設定
//     >
//       <Button colorScheme="red" onClick={handleLogout}>
//         ログアウト
//       </Button>
//     </Box>
//   );
// }


import { Button, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import supabase from "@/libs/supabase";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      console.log("ログアウト完了");
      //router.replace("/auth"); // ログアウト後にリダイレクト
    } catch (error) {
      console.error("ログアウトエラー:", error);
      alert("ログアウトに失敗しました。");
    }
  };

  return (
    <Box
      position="fixed" // スクロールしても固定
      top="1rem" // 上端から1rem
      right="1rem" // 右端から1rem
      zIndex="1000" // 高い優先度で表示
      bg="white" // 背景色を白に設定
      boxShadow="lg" // 影を追加
      borderRadius="md" // ボタン周りに丸みを追加
      p="1" // 余白を設定
    >
      <Button
        colorScheme="red"
        onClick={handleLogout}
        size="sm" // ボタンサイズを小さく設定（変更箇所）
        fontSize="sm" // ボタン内の文字サイズを小さく設定（変更箇所）
        p={2} // ボタンの内側余白（パディング）を調整（変更箇所）
      >
        ログアウト
      </Button>
    </Box>
  );
}
