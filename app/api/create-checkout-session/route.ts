import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getURL } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

//POST 함수는 웹훅의 진입점으로, 요청 객체를 인자로 받아 처리
export async function POST(request: Request) {
  //웹훅 요청에서 받은 JSON 데이터에서 price, quantity, metadata 값을 추출합니다. quantity와 metadata는 선택적으로 제공될 수 있으며, 기본값은 각각 1과 빈 객체입니다.
  const { price, quantity = 1, metadata = {} } = await request.json();

  //createRouteHandlerClient 함수를 사용하여 supabase 클라이언트를 생성합니다. createRouteHandlerClient 함수는 인증된 요청으로부터 cookies 정보를 추출하여 Supabase 클라이언트를 생성합니다. 그리고 해당 사용자의 정보를 supabase.auth.getUser()를 사용하여 가져옵니다.
  try {
    const supabase = createRouteHandlerClient({
      cookies,
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    //createOrRetrieveCustomer 함수를 사용하여 구독을 위한 고객 정보를 생성하거나 가져옵니다. 해당 함수는 Supabase의 사용자 ID와 이메일을 사용하여 고객 정보를 관리하는데 사용됩니다.
    const customer = await createOrRetrieveCustomer({
      uuid: user?.id || "",
      email: user?.email || "",
    });

    //Stripe Checkout 세션을 생성합니다. 세션 생성에 필요한 정보와 구독에 대한 세부 사항을 전달합니다. 결제 방법으로 카드를 사용하고, 필수적으로 청구 주소를 수집합니다. 구독 관련 정보와 세션 완료 시 리다이렉트 URL, 취소 시 리다이렉트 URL 등을 설정합니다.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata,
      },
      success_url: `${getURL()}/account`,
      cancel_url: `${getURL()}/`,
    });

    //Stripe Checkout 세션을 생성합니다. 세션 생성에 필요한 정보와 구독에 대한 세부 사항을 전달합니다. 결제 방법으로 카드를 사용하고, 필수적으로 청구 주소를 수집합니다. 구독 관련 정보와 세션 완료 시 리다이렉트 URL, 취소 시 리다이렉트 URL 등을 설정합니다.
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.log(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//Stripe Checkout 세션을 생성하는 웹훅 핸들러 함수입니다. Stripe Checkout 세션은 웹훅 요청을 통해 생성되며, 이를 사용하여 구독 결제를 위한 결제 페이지를 만들 수 있습니다.
