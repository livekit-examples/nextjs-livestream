import { HomeActions } from "@/components/home-actions";
import { Container, Flex, Kbd, Text } from "@radix-ui/themes";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-10 sm:p-24">
      <Container>
        <Flex direction="column" align="center" gap="6">
          <Image
            src="/wordmark.svg"
            alt="LiveKit"
            width="240"
            height="120"
            className="invert dark:invert-0"
          />
          <Text as="p" className="w-[380px]">
            Welcome to the LiveKit live streaming demo app. You can join or
            start your own stream. Hosted on LiveKit Cloud. Bored of the current
            color theme? Switch it up by pressing <Kbd>⌘&thinsp;C</Kbd> !
          </Text>
          <HomeActions />
        </Flex>
      </Container>
    </main>
  );
}
