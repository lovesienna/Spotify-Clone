import { Song } from "@/types";

import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";

import { useUser } from "./useUser";
import useSubscribeModal from "./useSubscribeModal";

// useOnPlay 커스텀 훅 정의
const useOnPlay = (songs: Song[]) => {
  // usePlayer, useAuthModal, useUser 훅들을 사용하여 필요한 상태와 함수 가져오기
  const player = usePlayer();
  const subscribeModal = useSubscribeModal();
  const authModal = useAuthModal();
  const { user, subscription } = useUser();

  // onPlay 함수 정의: 특정 노래를 재생할 때 실행됨
  const onPlay = (id: string) => {
    // 사용자가 로그인하지 않은 경우 인증 모달을 열도록 처리
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }

    // 사용자가 로그인한 경우, 플레이어에 선택한 노래 ID를 설정하고 모든 노래 ID를 설정함
    player.setId(id); //유저가 클릭한 노래
    player.setIds(songs.map((song) => song.id));
  };

  //useOnPlay 훅은 그 자체로 onPlay 함수를 반환하는 역할을 하기 때문에, 추가적으로 return onPlay; 구문을 사용해주어야 하는 것입니다.
  return onPlay;
};

// useOnPlay 커스텀 훅 내보내기
export default useOnPlay;
