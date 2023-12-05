"use client";

import {
  Button,
  Dialog,
  Flex,
  RadioGroup,
  Text,
  TextField,
} from "@radix-ui/themes";
import Link from "next/link";
import { useState } from "react";

export function IngressDialog({ children }: { children: React.ReactNode }) {
  const [roomName, setRoomName] = useState("");
  const [type, setType] = useState("rtmp");

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Setup ingress endpoint</Dialog.Title>
        <Flex direction="column" gap="3" mt="4">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Room name
            </Text>
            <TextField.Input
              type="text"
              placeholder="abcd-1234"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Ingress type
            </Text>
            <RadioGroup.Root>
              <Flex gap="2" direction="column">
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item
                      value="rtmp"
                      checked={type === "rtmp"}
                      onClick={() => setType("rtmp")}
                    />{" "}
                    RTMP
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <RadioGroup.Item
                      value="whip"
                      checked={type === "whip"}
                      onClick={() => setType("whip")}
                    />{" "}
                    WHIP
                  </Flex>
                </Text>
              </Flex>
            </RadioGroup.Root>
          </label>
        </Flex>

        <Flex gap="3" mt="6" justify="end">
          <Dialog.Close>
            <Button
              variant="soft"
              color="gray"
              onClick={() => {
                setRoomName("");
                setType("rtmp");
              }}
            >
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Link href={`/ingress/${roomName}?type=${type}`}>
              <Button disabled={!(roomName && type)}>Create</Button>
            </Link>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
