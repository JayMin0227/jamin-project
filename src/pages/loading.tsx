// src/pages/loading.tsx
// src/pages/loading.tsx
import { Center, Spinner, VStack, Heading } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Center h="100vh">
      <VStack spacing={4}>
        <Spinner size="xl" />
        <Heading size="md">読み込み中...</Heading>
      </VStack>
    </Center>
  );
}
