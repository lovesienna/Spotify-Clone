import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getURL } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

// Stripe 빌링 포털 URL을 생성하는 웹훅 핸들러 함수입니다.
export async function POST() {
  try {
    // Supabase 클라이언트를 생성합니다.
    const supabase = createRouteHandlerClient({ cookies });

    // Supabase로부터 인증된 사용자 정보를 가져옵니다.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 사용자 정보가 없는 경우 에러를 던집니다.
    if (!user) throw Error("Could not get user");

    // 고객 정보를 생성하거나 가져옵니다.
    const customer = await createOrRetrieveCustomer({
      uuid: user.id || "",
      email: user.email || "",
    });

    // 고객 정보가 없는 경우 에러를 던집니다.
    if (!customer) throw Error("Could not get customer");

    // Stripe 빌링 포털 세션을 생성하여 포털 URL을 가져옵니다.
    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/account`,
    });

    // 생성된 URL을 JSON 형태로 응답합니다.
    return NextResponse.json({ url });
  } catch (err: any) {
    // 에러가 발생한 경우 콘솔에 에러를 출력하고, 상태 코드 500과 함께 "Internal Error" 메시지를 포함한 응답을 반환합니다.
    console.log(err);
    new NextResponse("Internal Error", { status: 500 });
  }
}

// Supabase와 Stripe를 이용하여 빌링 포털 URL을 생성하는 웹훅 핸들러 함수입니다. createRouteHandlerClient 함수를 사용하여 Supabase 클라이언트를 생성하고, 인증된 사용자 정보를 가져온 뒤 해당 사용자의 고객 정보를 생성하거나 가져옵니다. 그리고 Stripe 빌링 포털 세션을 생성하여 포털 URL을 가져오고, 이를 JSON 형태로 응답합니다. 함수 실행 도중 에러가 발생하면 콘솔에 에러를 출력하고, 상태 코드 500과 함께 "Internal Error" 메시지를 포함한 응답을 반환합니다.
