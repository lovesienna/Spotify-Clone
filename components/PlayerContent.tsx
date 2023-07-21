"use client";

import { Song } from "@/types";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { useState } from "react";

import usePlayer from "@/hooks/usePlayer";

import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import Slider from "./Slider";
import useSound from "use-sound";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  //props의 타입 정의
  song,
  songUrl,
}) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    // 현재 재생 곡을 찾아서 다음 곡을 플레이 하도록.
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    // 다음 곡 없으면 첫번째 곡을 플레이 하도록.
    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    //있으면 다음 곡을 플레이 하도록.
    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    // 현재 재생 곡을 찾아서 다음 곡을 플레이 하도록.
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex + 1];

    // 다음 곡 없으면 첫번째 곡을 플레이 하도록.
    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    //있으면 다음 곡을 플레이 하도록.
    player.setId(previousSong);
  };

  const [play, { pause, sound }] = useSound(songUrl);

  return (
    <div
      className="
        grid 
        grid-cols-2
        md:grid-cols-3 
        h-full
        "
    >
      {/* PlayerContent 컴포넌트는 그리드 레이아웃으로 구성됩니다.
            3개의 컬럼으로 구성되며, 미디어 아이템과 좋아요 버튼을 담고 있습니다. */}

      <div
        className="
            flex
            w-full
            justify-start
            "
      >
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          {/* MediaItem 컴포넌트에 data라는 이름의 props를 전달합니다. data라는 이름의 props에는 song이라는 변수가 할당되어 있습니다. 이 props를 MediaItem 컴포넌트 내부에서 사용하면, song 변수의 데이터를 접근할 수 있게 됩니다. */}
          <LikeButton songId={song.id} />
          {/* LikeButton 컴포넌트에 songId라는 이름의 props를 전달합니다. songId라는 이름의 props에는 song.id가 할당되어 있습니다. 이 props를 LikeButton 컴포넌트 내부에서 사용하면, song.id의 값을 접근할 수 있게 됩니다. */}
        </div>
      </div>

      <div
        className="
            flex
            md:hidden
            col-auto
            w-full
            justify-end
            items-center
            "
      >
        <div
          onClick={() => {}}
          className="
                h-10
                w-10
                flex
                items-center
                justify-center
                rounded-full
                bg-white
                p-1
                cursor-pointer
                "
        >
          <Icon size={30} className="text-black" />
        </div>
      </div>

      <div
        className="
      hidden
      h-full
      md:flex
      justify-center
      items-center
      w-full
      max-w-[722px]
      gap-x-6
      "
      >
        <AiFillStepBackward
          size={30}
          className="text-neutral-400 cursor-pointer hover:text-white transition
"
        />
        <div
          onClick={onPlayPrevious}
          className="
            flex
            items-center
            justify-center
            h-10
            w-10
            rounded-full
            bg-white
            p-1
            cursor-pointer
            "
        >
          <Icon size={30} className="text-black" />
        </div>
        <AiFillStepForward
          onClick={onPlayNext}
          size={30}
          className="
            text-neutral-400
            cursor-pointer
            hover:text-white
            transition
            "
        />
      </div>

      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon onClick={() => {}} className="cursor-pointer" size={34} />
          <Slider />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;

// 이 컴포넌트는 현재 플레이되고 있는 노래를 표시하는 컴포넌트이자, 재생, pause, 볼륨 조절 등을 담당하는 컴포넌트이다.\
// 즉, MediaItem 컴포넌트는 song이라는 데이터를 사용하여 미디어 아이템을 렌더링하고,
// LikeButton 컴포넌트는 song.id 값을 사용하여 좋아요 버튼을 렌더링하게 됩니다.
// props를 통해 데이터를 전달하여 컴포넌트들이 동작하도록 하는 것이 React 컴포넌트의 핵심적인 개념 중 하나입니다.
