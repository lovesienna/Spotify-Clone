import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const useGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);
  const { supabaseClient } = useSessionContext();

  // id 값이 변경될 때마다 실행되는 useEffect
  useEffect(() => {
    // id가 없는 경우에는 노래 정보를 가져오지 않음
    if (!id) {
      return;
    }

    setIsLoading(true);

    // Supabase를 통해 해당 ID의 노래 정보 가져오기
    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setIsLoading(false);
        return toast.error(error.message);
      }

      // 노래 정보를 상태 변수에 설정하고 로딩 상태 해제
      setSong(data as Song);
      setIsLoading(false);
    };

    fetchSong();
  }, [id, supabaseClient]);

  // 결과 값 리턴
  return useMemo(
    () => ({
      isLoading, // 로딩 상태
      song, // 노래 정보
    }),
    [isLoading, song]
  );
};

export default useGetSongById;

//이 커스텀 훅은 useEffect를 사용하여 id가 변경될 때마다 Supabase 데이터베이스에서 해당 ID의 노래 정보를 가져오고,
//가져온 정보를 상태 변수에 저장합니다. 가져오는 동안 로딩 상태를 관리하며, 에러가 발생하면 알림 토스트를 띄웁니다.
//가져온 정보와 로딩 상태를 반환하고, 불필요한 재렌더링을 방지하기 위해 useMemo를 사용합니다.
