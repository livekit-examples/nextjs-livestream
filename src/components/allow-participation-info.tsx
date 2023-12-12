"use client";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { AccessibleIcon, IconButton, Popover, Text } from "@radix-ui/themes";

export function AllowParticipationInfo() {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton size="1" variant="ghost" color="gray">
          <AccessibleIcon label="Learn more about panel background options">
            <InfoCircledIcon />
          </AccessibleIcon>
        </IconButton>
      </Popover.Trigger>

      <Popover.Content
        size="1"
        style={{ maxWidth: 360 }}
        side="top"
        align="center"
      >
        <Text as="p" size="1">
          If enabled, viewers can <Text weight="bold">raise their hand</Text>{" "}
          and can also share their audio and video if accepted by the host. The
          host can also <Text weight="bold">invite</Text> viewers to share their
          audio and video.
        </Text>
      </Popover.Content>
    </Popover.Root>
  );
}
