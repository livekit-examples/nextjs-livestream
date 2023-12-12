import { useCopyToClipboard } from "@/lib/clipboard";
import { ParticipantMetadata } from "@/lib/controller";
import {
  AudioTrack,
  StartAudio,
  VideoTrack,
  useDataChannel,
  useLocalParticipant,
  useParticipants,
  useRoomInfo,
  useTracks,
} from "@livekit/components-react";
import { CopyIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Badge, Button, Flex, Grid } from "@radix-ui/themes";
import Confetti from "js-confetti";
import { LocalTrack, Track, createLocalTracks } from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PresenceDialog } from "./presence-dialog";

function ConfettiCanvas() {
  const [confetti, setConfetti] = useState<Confetti>();
  const [decoder] = useState(() => new TextDecoder());
  const canvasEl = useRef<HTMLCanvasElement>(null);
  useDataChannel("reactions", (data) => {
    const options: { emojis?: string[]; confettiNumber?: number } = {};

    if (decoder.decode(data.payload) !== "🎉") {
      options.emojis = [decoder.decode(data.payload)];
      options.confettiNumber = 12;
    }

    confetti?.addConfetti(options);
  });

  useEffect(() => {
    setConfetti(new Confetti({ canvas: canvasEl?.current ?? undefined }));
  }, []);

  return <canvas ref={canvasEl} className="absolute h-full w-full" />;
}

export function StreamPlayer({ isHost = false }) {
  const [muted, setMuted] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalTrack>();
  const [localAudioTrack, setLocalAudioTrack] = useState<LocalTrack>();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [_, copy] = useCopyToClipboard();

  const localVideoEl = useRef<HTMLVideoElement>(null);

  const { name: roomName } = useRoomInfo();
  const { localParticipant } = useLocalParticipant();
  const localMetadata = (localParticipant.metadata &&
    JSON.parse(localParticipant.metadata)) as ParticipantMetadata;
  const canHost =
    isHost || (localMetadata?.invited_to_stage && localMetadata?.hand_raised);
  const participants = useParticipants();
  const showNotification = isHost
    ? participants.some((p) => {
        const metadata = (p.metadata &&
          JSON.parse(p.metadata)) as ParticipantMetadata;
        return metadata?.hand_raised && !metadata?.invited_to_stage;
      })
    : localMetadata?.invited_to_stage && !localMetadata?.hand_raised;

  const togglePublishing = useCallback(async () => {
    if (isPublishing && localParticipant.permissions?.canPublish) {
      setIsUnpublishing(true);

      if (localVideoTrack) {
        void localParticipant.unpublishTrack(localVideoTrack);
      }
      if (localAudioTrack) {
        void localParticipant.unpublishTrack(localAudioTrack);
      }

      await createTracks();

      setTimeout(() => {
        setIsUnpublishing(false);
      }, 2000);
    } else if (localParticipant) {
      if (localVideoTrack) {
        void localParticipant.publishTrack(localVideoTrack);
      }
      if (localAudioTrack) {
        void localParticipant.publishTrack(localAudioTrack);
      }
    }
    setIsPublishing((prev) => !prev);
  }, [localAudioTrack, isPublishing, localParticipant, localVideoTrack]);

  const createTracks = async () => {
    const tracks = await createLocalTracks({ audio: true, video: true });
    tracks.forEach((track) => {
      switch (track.kind) {
        case Track.Kind.Video: {
          if (localVideoEl?.current) {
            track.attach(localVideoEl.current);
          }
          setLocalVideoTrack(track);
          break;
        }
        case Track.Kind.Audio: {
          setLocalAudioTrack(track);
          break;
        }
      }
    });
  };

  useEffect(() => {
    if (canHost) {
      void createTracks();
    }
  }, [canHost]);

  useEffect(() => {
    return () => {
      localVideoTrack?.stop();
      localAudioTrack?.stop();
    };
  }, [localVideoTrack, localAudioTrack]);

  const videoTracks = useTracks([Track.Source.Camera]).filter(
    (t) => t.participant.identity !== localParticipant.identity
  );

  const audioTracks = useTracks([Track.Source.Microphone]).filter(
    (t) => t.participant.identity !== localParticipant.identity
  );

  return (
    <div className="relative h-full w-full bg-black">
      <Grid className="w-full h-full absolute" gap="2">
        {canHost && (
          <div className="relative">
            <video
              ref={localVideoEl}
              className="absolute w-full h-full object-contain -scale-x-100"
            />
            <div className="absolute w-full h-full">
              <Badge
                variant="outline"
                color="gray"
                className="absolute bottom-2 right-2"
              >
                {localParticipant.identity} (you)
              </Badge>
            </div>
          </div>
        )}
        {videoTracks.map((t) => (
          <div key={t.participant.identity} className="relative">
            <VideoTrack
              trackRef={t}
              className="absolute w-full h-full bg-transparent"
            />
            <div className="absolute w-full h-full">
              <Badge
                variant="outline"
                color="gray"
                className="absolute bottom-2 right-2"
              >
                {t.participant.identity}
              </Badge>
            </div>
          </div>
        ))}
      </Grid>
      {audioTracks.map((t, i) => (
        <AudioTrack trackRef={t} key={i} />
      ))}
      <ConfettiCanvas />
      <StartAudio
        label="Click to allow audio playback"
        className="absolute top-0 h-full w-full bg-gray-2-translucent text-white"
      />
      <div className="absolute top-0 w-full p-2">
        <Flex justify="between" align="end">
          <Button
            size="1"
            variant="soft"
            disabled={!Boolean(roomName)}
            onClick={() => copy(roomName)}
          >
            {roomName ? (
              <>
                {roomName} <CopyIcon />
              </>
            ) : (
              "Loading..."
            )}
          </Button>
          <Flex gap="2">
            {canHost &&
              (isPublishing ? (
                <Button size="1" color="red" onClick={togglePublishing}>
                  {isUnpublishing ? "Stopping..." : "Stop stream"}
                </Button>
              ) : (
                <Button size="1" onClick={togglePublishing}>
                  Start stream
                </Button>
              ))}
            <PresenceDialog isHost={isHost}>
              <div className="relative">
                {showNotification && (
                  <div className="absolute flex h-3 w-3 -top-1 -right-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-6 bg-accent-11 opacity-75"></span>
                    <span className="relative inline-flex rounded-6 h-3 w-3 bg-accent-11"></span>
                  </div>
                )}
                <Button size="1" variant="soft">
                  <EyeOpenIcon />
                  {participants.length}
                </Button>
              </div>
            </PresenceDialog>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}
