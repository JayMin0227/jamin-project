import { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Input,
  HStack,
  Tag,
} from "@chakra-ui/react";
import axios from "axios";
// src/pages/book.tsx
import { formatDate } from "../utils/formatDate";
import { useRecoilValue } from "recoil";

import { VStack, Box } from "@chakra-ui/react";

// /home/jaymin/pbl_next_jay/src/pages/book.tsx
import { useRouter } from "next/router";
import supabase from "@/libs/supabase";
import { sessionState } from "@/libs/states";
import { useRecoilState } from "recoil";
import { LogoutButton } from "@/components/Buttons/LogOutButton"; // ログアウトボタンをインポート
import {  useRef } from "react";
import { Link as ChakraLink, Text } from "@chakra-ui/react"; // Chakra UI の Link をインポート
import NextLink from "next/link"; // Next.js の Link をインポート
import { SearchIcon } from "@chakra-ui/icons";



interface Memo {
  id: number;
  title: string;
  content: string;
  tags: string[]; // tags は配列として扱う
  created_at: string;
  formattedDate?: string; // 追加
}

function ensureTagsArray(tags: string | string[] | undefined): string[] {
  if (Array.isArray(tags)) {
      return tags;
  } else if (typeof tags === "string") {
      return tags.split(",");
  }
  return [];
}



export default function MemoApp() {
 
  const [session, setSession] = useRecoilState(sessionState);

  const [memos, setMemos] = useState<Memo[]>([]); // メモの一覧をMemo型の配列として定義

  const [newTitle, setNewTitle] = useState(""); // 新しいメモのタイトル
  const [newContent, setNewContent] = useState(""); // 新しいメモの内容
  const [newTags, setNewTags] = useState(""); // 新しいメモのタグ（カンマ区切り）


  const router = useRouter(); // ルーティング操作用

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // サイドバーの開閉状態を管理








const [editMemoId, setEditMemoId] = useState<number | null>(null); // 編集中のメモID
const [editTitle, setEditTitle] = useState(""); // 編集中のタイトル
const [editContent, setEditContent] = useState(""); // 編集中の内容
const [editTags, setEditTags] = useState(""); // 編集中のタグ



const [showSearchInput, setShowSearchInput] = useState(false); // 検索入力欄の表示状態
const [searchKeyword, setSearchKeyword] = useState(""); // 検索キーワード




  // 未認証時のリダイレクト
  useEffect(() => {
    if (!session) {
      console.log("未認証状態: /auth にリダイレクト");
      router.replace("/auth"); // ログインしていない場合
    }
  }, [session, router]);





  // フィルタリングされたメモを取得
const filteredMemos = memos.filter((memo) => {
  if (!searchKeyword) return true; // 検索キーワードがなければ全て表示
  const keyword = searchKeyword.toLowerCase();
  const inTitle = memo.title.toLowerCase().includes(keyword);
  const inContent = memo.content.toLowerCase().includes(keyword);
  const inTags = memo.tags.some((tag) => tag.toLowerCase().includes(keyword));
  return inTitle || inContent || inTags;
});

// groupedMemos の作成時に filteredMemos を使用
const groupedMemos = filteredMemos.reduce((acc: Record<string, Memo[]>, memo) => {
  const date = memo.created_at.split("T")[0];
  if (!acc[date]) acc[date] = [];
  acc[date].push(memo);
  return acc;
}, {});






  // 日付フォーマット用関数
  // 日付フォーマット用関数
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    // 日本時間に変換（UTC + 9時間）
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);



    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
    const month = date.getMonth() + 1; // 月は0から始まるので+1
    const day = date.getDate();
    const weekDay = dayNames[date.getDay()]; // 曜日を取得
    return `${month}/${day}(${weekDay})`; // 正しい書き方// "12/1(金)"の形式で返す
  };
  

  // ページを開いたときにメモを取得
  useEffect(() => {
    if (session) {
      fetchMemos();
    }
  }, [session]);






  // // 日付ごとにグループ化されたメモ // 追加したよーん
  // const groupedMemos = memos.reduce((acc: Record<string, Memo[]>, memo) => {
  //   const date = memo.created_at.split("T")[0]; // "2024-12-01" 形式で日付を取得
  //   if (!acc[date]) acc[date] = [];
  //   acc[date].push(memo);
  //   return acc;
  // }, {});

  // 日付ブロックの参照を保持 // 追加したよーん
  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});







  // // サーバーからメモ一覧を取得する関数
  // const fetchMemos = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:8000/ideas");
  //     console.log("サーバーから取得したデータ:", res.data);
  
  //     // データをそのまま使用し、必要な整形のみ実施
  //     const sortedMemos = res.data.map((memo: Memo) => ({
  //       ...memo,
  //       tags: Array.isArray(memo.tags) ? memo.tags : [],
  //       formattedDate: formatDate(memo.created_at),
  //     }));
  
  //     console.log("整形後のデータ:", sortedMemos);
  //     setMemos(sortedMemos);
  //   } catch (err) {
  //     console.error("メモ取得エラー:", err);
  //   }
  // };

  useEffect(() => {
    fetchMemos();
  }, [searchKeyword]); // searchKeyword が変更されるたびに fetchMemos を呼び出す
  

  const fetchMemos = async () => {
    try {
      let res;
      if (searchKeyword) {
        // 検索キーワードがある場合は検索APIを呼び出す
        res = await axios.get("http://localhost:8000/ideas/search", {
          params: { keyword: searchKeyword },
        });
      } else {
        // 検索キーワードがない場合は全てのメモを取得
        res = await axios.get("http://localhost:8000/ideas");
      }
      const sortedMemos = res.data.map((memo: Memo) => ({
        ...memo,
        tags: Array.isArray(memo.tags) ? memo.tags : [],
        formattedDate: formatDate(memo.created_at),
      }));
      setMemos(sortedMemos);
    } catch (err) {
      console.error("メモ取得エラー:", err);
    }
  };

  






  

  
  
  
  

  // 新しいメモを追加する関数
  const addMemo = async () => {
    if (!newTitle || !newContent) {
      alert("タイトルと内容を入力してください！");
      return;
    }
  
    const newMemo = {
      title: newTitle,
      content: newContent,
      tags: newTags,
    };
  
    console.log("送信するデータ:", newMemo); // デバッグ用
  
    try {
      await axios.post("http://localhost:8000/ideas", newMemo);
      setNewTitle("");
      setNewContent("");
      setNewTags("");
      fetchMemos(); // メモ一覧を更新
    } catch (err) {
      console.error("メモ追加エラー:", err);
      alert("メモの追加に失敗しました。");
    }
  };
  

  // メモを削除する関数
  const deleteMemo = async (id: number): Promise<void> => {
    try {
      await axios.delete(`http://localhost:8000/ideas/${id}`);
      fetchMemos(); // メモ一覧を更新
    } catch (err) {
      console.error("削除エラー:", err);
      alert("削除に失敗しました。");
    }
  };





  

  const updateMemo = async (id: number) => {
    try {
      const updatedMemo = {
        title: editTitle,
        content: editContent,
        tags: editTags, // カンマ区切りの文字列
      };
      await axios.put(`http://localhost:8000/ideas/${id}`, updatedMemo); // APIを呼び出し
      setEditMemoId(null); // 編集モードを解除
      fetchMemos(); // メモ一覧を再取得
    } catch (err) {
      console.error("メモ更新エラー:", err);
      alert("メモの更新に失敗しました。");
    }
  };
  
  






  const handleLogout = async () => {
    try {
      // 即座に/authページにリダイレクト
      router.replace("/auth");
  
      // 認証情報を消去
      await supabase.auth.signOut();
      console.log("ログアウト完了");
    } catch (error) {
      console.error("ログアウトエラー:", error);
      alert("ログアウトに失敗しました。");
    }
  };
  
  




return (
  <HStack align="start" spacing={0} w="100vw" h="100vh">
    {/* サイドバー: 作業日時目次 */}
    <Box
  h="100%"
  flex={isSidebarOpen ? 0.2 : 0.1} // 横幅を調整 (20% or 10%)
  overflowY="auto"
  bg="gray.100"
  shadow="lg"
  transition="flex 0.3s ease-in-out" // 幅変更時のアニメーション
  zIndex="1000"
  minWidth={isSidebarOpen ? "150px" : "80px"} // 最小幅を設定
>

  {isSidebarOpen ? (
    <Box p="4">
      {/* タイトルと検索アイコン */}
      <HStack justifyContent="space-between" mb="4">
      <Text
  fontWeight="bold"
  wordBreak="break-word" // 文字がサイドバー内で折り返される
>
  作業日時目次
</Text>

        <SearchIcon
          cursor="pointer"
          onClick={() => setShowSearchInput(!showSearchInput)} // 検索入力欄の表示切替
        />
      </HStack>

      {/* 検索入力欄 */}
      {showSearchInput && (
        <Input
          placeholder="検索ワードを入力"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          mb="4"
        />
      )}

      {/* 日時目次リンク */}
      <VStack align="start" spacing={2}>
        {Object.keys(groupedMemos)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) // 日付を早い順にソート
          .map((date) => (
            <ChakraLink
              key={date}
              as={NextLink}
              href={`#${date}`}
              fontSize="sm"
              color="blue.500"
              _hover={{ textDecoration: "underline" }}
            >
              {date}
            </ChakraLink>
          ))}
      </VStack>

      {/* 閉じるボタン */}
      <Button
        mt="4"
        colorScheme="teal"
        size="sm"
        onClick={() => setIsSidebarOpen(false)} // 目次を閉じる
      >
        閉じる
      </Button>
    </Box>
  ) : (
    <Button
      position="absolute"
      top="1rem"
      left="1rem"
      colorScheme="teal"
      size="sm"
      onClick={() => setIsSidebarOpen(true)} // 目次を開く
    >
      目次
    </Button>
  )}
</Box>


    {/* メモ一覧 */}
    <Box
  h="calc(100vh - 80px)" // 画面全体の高さからフォームと余白分を引く
  flex="1" // 横幅はサイドバーを除いた残り全てを使用
  overflowY="auto" // 縦方向のスクロールを許可
  bg="white"
  p="4"
>

      {/* ログアウトボタン */}
      <Box position="fixed" top="1rem" right="1rem" zIndex="10">
        <LogoutButton />
      </Box>

      {/* 日付ごとのメモ表示 */}
      {Object.entries(groupedMemos).map(([date, memos]) => (
        <Box
          key={date}
          id={date}
          p="4"
          borderWidth="1px"
          borderRadius="md"
          bg="white"
          shadow="sm"
        >
          <Text fontWeight="bold" fontSize="lg" mb="2">
            {date}
          </Text>
          <TableContainer>
          <Table variant="simple" size="sm">
  <Thead>
    <Tr>
      <Th w="15%">タイトル</Th> {/* タイトル列の幅 */}
      <Th w="57%">内容</Th>    {/* 内容列の幅 */}
      <Th w="20%">タグ</Th>    {/* タグ列の幅 */}
      <Th w="8%">操作</Th>    {/* 操作列の幅 */}
    </Tr>
  </Thead>
  <Tbody>
    {memos.map((memo) =>
      editMemoId === memo.id ? (
        <Tr key={memo.id}>
          <Td>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </Td>
          <Td>
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </Td>
          <Td>
            <Input
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
            />
          </Td>
          <Td>
            <Button
              colorScheme="green"
              size="sm"
              onClick={() => updateMemo(memo.id)}
            >
              保存
            </Button>
            <Button
              size="sm"
              onClick={() => setEditMemoId(null)}
              ml={2}
            >
              キャンセル
            </Button>
          </Td>
        </Tr>
      ) : (
        <Tr key={memo.id}>
          <Td w="15%">{memo.title}</Td>
          <Td w="46%">{memo.content}</Td>
          <Td w="31%">
            {memo.tags.map((tag, index) => (
              <Tag key={index} mr={1}>
                {tag}
              </Tag>
            ))}
          </Td>
          <Td w="10%">
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => {
                setEditMemoId(memo.id);
                setEditTitle(memo.title);
                setEditContent(memo.content);
                setEditTags(memo.tags.join(","));
              }}
            >
              編集
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => deleteMemo(memo.id)}
              ml={2}
            >
              削除
            </Button>
          </Td>
        </Tr>
      )
    )}
  </Tbody>
</Table>

          </TableContainer>
        </Box>
      ))}
    </Box>

    {/* フォーム */}
    <Box
  position="fixed"
  bottom="0"
  left={isSidebarOpen ? "17%" : "9%"} // サイドバーの幅を考慮
  width={isSidebarOpen ? "80%" : "90%"} // 残りの横幅を使用
  bg="white"
  p="4"
  boxShadow="0 -2px 5px rgba(0,0,0,0.1)"
  zIndex="100"
>
  <HStack spacing={4} align="center">
    {/* タイトル入力 */}
    <Input
      placeholder="タイトル"
      value={newTitle}
      onChange={(e) => setNewTitle(e.target.value)}
      flex="2" // タイトル列の横幅に合わせる
    />
    {/* 内容入力 */}
    <Input
      placeholder="内容"
      value={newContent}
      onChange={(e) => setNewContent(e.target.value)}
      flex="5" // 内容列の横幅に合わせる
    />
    {/* タグ入力 */}
    <Input
      placeholder="タグ (カンマ区切り)"
      value={newTags}
      onChange={(e) => setNewTags(e.target.value)}
      flex="2" // タグ列の横幅に合わせる
    />
    {/* 追加ボタン */}
    <Button
      colorScheme="teal"
      size={{ base: "sm", md: "md" }}
      onClick={addMemo}
      flex="1" // 操作列の横幅に合わせるんだよね
    >
      追加
    </Button>
  </HStack>
</Box>


  </HStack>
);
}