import { Avatar, Heading } from "@chakra-ui/react";
import { Session } from "@supabase/supabase-js";
import { useRecoilState } from "recoil";
import { sessionState } from "@/libs/states";

export function HelloUserMessage() {
  const [session] = useRecoilState<Session | null>(sessionState);

  return (
    <>
      <Avatar
        src={
          session?.user.user_metadata["picture"]
            ? session?.user.user_metadata["picture"]
            : session?.user.user_metadata["avatar_url"]
        }
      />
      <Heading fontSize = "6xl">
        メモ帳 {session?.user.user_metadata["name"]} 
      </Heading>
    </>
  );
}