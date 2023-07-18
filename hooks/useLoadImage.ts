import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { Song } from "@/types";

const useLoadImage = (song: Song) => {
  const supabaseClient = useSupabaseClient();

  if (!song) {
    return null;
  }

  const { data: imageData } = supabaseClient.storage
    .from("images")
    .getPublicUrl(song.image_path);

  return imageData.publicUrl;
};

export default useLoadImage;

//이 코드는 Supabase 클라이언트를 사용하여 이미지의 공용 URL을 가져오는 커스텀 훅(useLoadImage)을 정의합니다.
//Song이라는 타입의 매개변수를 받아서, 해당 노래의 이미지 경로(song.image_path)에 해당하는 이미지의 공용 URL을 반환합니다.
//먼저 Supabase 클라이언트를 가져오기 위해 useSupabaseClient 훅을 사용하고, 이를 통해 이미지의 공용 URL을 가져오기 위해
//supabaseClient.storage.getPublicUrl 메서드를 호출합니다. 만약 매개변수로 받은 song이 없을 경우에는 null을 반환합니다.

//이 커스텀 훅을 사용하면, 다른 컴포넌트에서 해당 노래에 대한 이미지 공용 URL을 간편하게 가져와서 사용할 수 있습니다.
