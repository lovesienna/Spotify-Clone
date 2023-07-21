"use client";

import useGetSongById from "@/hooks/useGetSongById";
import usePlayer from "@/hooks/usePlayer";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import PlayerContent from "./PlayerContent";

const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);

  const songUrl = useLoadSongUrl(song!);

  if (!song || !songUrl || !player.activeId) {
    return null;
  }
  // 이 부분이 있어야 song이 없을 땐 바닥에 플레이어 부분이 표시가 안됨.

  return (
    <div
      className="
  fixed
  bottom-0
  bg-black
  w-full
  py-2
  h-[80px]
  px-4
  "
    >
      <PlayerContent
        key={songUrl}
        //키를 이용하는 이유: 1. 맵 펑션 이용할거임 2. 키가 바뀔 때 마다 요소는 파괴가 되고 리렌더링 됨. 플레이리스트와 노래를 스킵하기 위해 키를 사용.
        //키를 안쓰면 노래가 오버로드되거나 아예 플레이가 안될 수 있음.
        song={song}
        songUrl={songUrl}
      />
    </div>
  );
};

export default Player;
