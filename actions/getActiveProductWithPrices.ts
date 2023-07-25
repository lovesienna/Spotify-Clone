import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { ProductWithPrice } from "@/types";

// getActiveProductsWithPrices 함수는 활성화된 제품과 가격 정보를 가져오는 비동기 함수입니다.
const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
  // Supabase 서버 사이드 클라이언트를 생성합니다.
  const supabase = createServerComponentClient({
    cookies: cookies, // 클라이언트 쿠키를 전달하여 인증에 사용합니다.
  });

  // products 테이블에서 활성화된 제품과 가격 정보를 쿼리합니다.
  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)") // products 테이블과 관련된 모든 필드와 prices 테이블 정보를 가져옵니다.
    .eq("active", true) // products 테이블에서 active 필드가 true인 레코드만 가져옵니다.
    .eq("prices.active", true) // prices 테이블에서 active 필드가 true인 레코드만 가져옵니다.
    .order("metadata->index") // metadata 객체의 index 필드를 기준으로 오름차순으로 정렬합니다.
    .order("unit_amount", { foreignTable: "prices" }); // prices 테이블의 unit_amount 필드를 기준으로 오름차순으로 정렬합니다.

  // 쿼리 결과에 오류가 있으면 오류 메시지를 콘솔에 출력합니다.
  if (error) {
    console.log(error.message);
  }

  // 쿼리 결과를 반환합니다. data는 any 타입이므로 ProductWithPrice[] 타입으로 캐스팅하여 반환합니다.
  return (data as any) || [];
};

export default getActiveProductsWithPrices;
