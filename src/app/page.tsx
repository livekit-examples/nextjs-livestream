import { BroadcastDialog } from "@/components/broadcast-dialog";
import { JoinDialog } from "@/components/join-dialog";
import { Button, Container, Flex, Kbd, Text } from "@radix-ui/themes";
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
            color theme? Switch it up by pressing <Kbd>⌘&thinsp;C</Kbd>.
          </Text>
          <Flex gap="2">
            <BroadcastDialog>
              <Button size="3">Stream from browser</Button>
            </BroadcastDialog>
            <JoinDialog>
              <Button variant="outline" size="3">
                Join existing stream
              </Button>
            </JoinDialog>
          </Flex>
        </Flex>
      </Container>
    </main>
  );
}
