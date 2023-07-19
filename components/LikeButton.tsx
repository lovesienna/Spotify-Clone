"use client";

import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import useAuthModal from "@/hooks/useAuthModal";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  // useSessionContext 훅을 사용하여 인증 관련 정보를 얻어옵니다.
  const { supabaseClient } = useSessionContext();

  // useAuthModal 훅을 사용하여 인증 모달과 관련된 상태와 함수를 가져옵니다.
  const authModal = useAuthModal();
  // useUser 훅을 사용하여 사용자 정보와 관련된 상태와 함수를 가져옵니다.
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // user.id가 존재하지 않을 경우 (사용자가 로그인하지 않았을 경우), 아무 작업도 하지 않고 함수를 종료합니다.
    if (!user?.id) {
      return;
    }

    // fetchData 함수를 정의하고, 해당 함수 내에서 현재 사용자가 해당 노래를 좋아요한 적이 있는지 확인합니다.
    const fetchData = async () => {
      // supabaseClient를 사용하여 "likes_songs" 테이블에서 현재 사용자가 해당 노래를 좋아요한 적이 있는지 검사합니다.
      const { data, error } = await supabaseClient
        .from("liked_songs")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single();
      // 에러가 없고, data가 존재한다면 사용자가 해당 노래를 좋아요한 상태로 isLiked 상태를 true로 설정합니다.
      if (!error && data) {
        setIsLiked(true);
      }
    };
    // fetchData 함수를 호출하여 사용자의 좋아요 상태를 가져옵니다.
    fetchData();
  }, [songId, supabaseClient, user?.id]);

  // isLiked에 따라 렌더링할 아이콘을 결정. 좋아요 상태에 따라 다른 아이콘이 렌더링.
  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  // handleLike 함수를 정의합니다. 좋아요 버튼을 클릭했을 때 호출됩니다.
  const handleLike = async () => {
    // 사용자가 로그인하지 않았을 경우, 인증 모달을 띄우고 함수를 종료합니다.
    if (!user) {
      return authModal.onOpen();
    }

    // isLiked 상태에 따라 다른 작업을 수행합니다.
    if (isLiked) {
      // 이미 좋아요를 눌렀을 경우, 해당 노래의 좋아요를 취소합니다.
      const { error } = await supabaseClient
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);

      // 에러가 발생한 경우 에러 메시지를 토스트로 표시하고, 그렇지 않은 경우 isLiked 상태를 false로 설정합니다.
      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      // 좋아요를 누르지 않은 경우, 해당 노래에 좋아요를 추가합니다.
      const { error } = await supabaseClient.from("liked_songs").insert({
        user_id: user.id,
        song_id: songId,
      });

      // 에러가 발생한 경우 에러 메시지를 토스트로 표시하고, 그렇지 않은 경우 isLiked 상태를 true로 설정하고 "Liked!" 메시지를 토스트로 표시합니다.
      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
        toast.success("Liked!");
      }
    }
    // 좋아요 작업이 완료되면 현재 페이지를 새로고침합니다.
    router.refresh();
  };

  return (
    <button
      className="
  hover:opacity-75
  transition
  "
      onClick={handleLike}
    >
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
};

export default LikeButton;
