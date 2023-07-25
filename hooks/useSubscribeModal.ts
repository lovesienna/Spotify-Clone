import { create } from "zustand";

interface SubscribeModalStore {
  isOpen: boolean; // 모달의 열림 상태를 나타내는 불리언 값
  onOpen: () => void; //모달을 열기 위한 함수, "매개변수가 없고 반환값이 없는 함수"를 나타냅니다. 이러한 함수는 보통 어떤 동작을 수행하거나 상태를 변경하는 등의 역할을 하기 위해 사용.
  onClose: () => void; // 모달을 닫기 위한 함수, 함수의 반환값이 없으므로 void를 사용하여 표시합니다.
}

const useSubscribeModal = create<SubscribeModalStore>((set) => ({
  isOpen: false, //// 초기 상태는 모달이 닫혀있는 상태로 설정합니다.
  onOpen: () => set({ isOpen: true }), // onOpen 함수는 상태를 업데이트하여 모달을 열기 위해 사용됩니다.
  onClose: () => set({ isOpen: false }), // onClose 함수는 상태를 업데이트하여 모달을 닫기 위해 사용됩니다.
}));

export default useSubscribeModal;
