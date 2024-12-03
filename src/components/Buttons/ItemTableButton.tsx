import { Button, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaBook } from "react-icons/fa";

export function ItemTableButton() {
  const router = useRouter();

  return (
    <Button
      colorScheme="blue"
      leftIcon={<Icon as={FaBook} />}
      onClick={() => router.push("/book")}
    >
      メモ
    </Button>
  );
}