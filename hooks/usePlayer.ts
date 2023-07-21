import { create } from "zustand";

interface PlayerStore {
  // 플레이어 ID를 저장하는 배열
  ids: string[];
  // 현재 활성화된 플레이어의 ID (선택적으로 저장)
  activeId?: string;
  // 플레이어 ID를 설정하는 함수
  setId: (id: string) => void;
  // 여러 플레이어 ID를 설정하는 함수
  setIds: (ids: string[]) => void;
  // 모든 플레이어 정보를 초기화하는 함수
  reset: () => void;
}

// 'usePlayer' 커스텀 훅을 생성하고 'create' 함수를 사용하여 상태 관리 로직을 정의함
const usePlayer = create<PlayerStore>((set) => ({
  // 플레이어 ID 배열 초기값 빈 배열로 설정
  ids: [],
  // 현재 활성화된 플레이어 ID 초기값 'undefined'로 설정
  activeId: undefined,
  // 'setId' 함수 정의: 전달된 ID로 'activeId' 상태를 업데이트
  setId: (id: string) => set({ activeId: id }),
  // 'setIds' 함수 정의: 전달된 배열로 'ids' 상태를 업데이트
  setIds: (ids: string[]) => set({ ids: ids }),
  // 'reset' 함수 정의: 'ids'와 'activeId' 상태를 초기화
  reset: () => set({ ids: [], activeId: undefined }),
}));

// 'usePlayer' 커스텀 훅을 외부로 내보냄
export default usePlayer;
