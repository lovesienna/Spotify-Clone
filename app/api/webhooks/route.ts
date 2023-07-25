import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/libs/stripe";
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
} from "@/libs/supabaseAdmin";

//relevantEvents 세트에는 웹훅이 처리할 특정 Stripe 이벤트 목록이 포함되어 있습니다. 이 목록에 나열된 이벤트만 처리하고 나머지 이벤트는 걸러냅니다.
const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

//POST 함수는 웹훅의 진입점입니다. 요청 객체를 받아와 처리합니다.
export async function POST(request: Request) {
  //요청 본문은 읽혀지고 body 변수에 저장됩니다.
  const body = await request.text();
  //Stripe 서명은 요청 헤더에서 추출됩니다.
  //웹훅 서명을 확인하여 요청의 신뢰성을 검증합니다.
  const sig = headers().get("Stripe-Signature");

  //stripe 웹훅 비밀은 환경 변수에서 가져옵니다 (STRIPE_WEBHOOK_SECRET_LIVE 또는 STRIPE_WEBHOOK_SECRET). 이 비밀은 들어오는 Stripe 이벤트의 진위성을 확인하는 데 사용됩니다.
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    //웹훅 서명은 stripe.webhooks.constructEvent 메서드를 사용하여 확인됩니다. 확인에 실패하면 상태 코드 400으로 오류 응답이 반환됩니다.
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  //이벤트 유형이 관련된 경우 (relevantEvents 세트에 있는 경우), 코드는 이벤트 유형에 따라 처리를 수행합니다.
  if (relevantEvents.has(event.type)) {
    try {
      //관련된 이벤트에 대해서만, switch 문을 사용하여 다양한 Stripe 이벤트 유형을 처리합니다. 이벤트 객체에서 관련 데이터를 추출하여 해당 처리를 수행합니다.
      //upsertProductRecord 및 upsertPriceRecord 함수는 데이터베이스에 제품과 가격 레코드를 데이터베이스에 생성하거나 업데이트합니다.
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          //manageSubscriptionStatusChange 함수는 고객의 구독 상태 변경을 처리합니다.
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new NextResponse(
        'Webhook error: "Webhook handler failed. View logs."',
        { status: 400 }
      );
    }
  }
  //이벤트 처리가 완료되면 상태 코드 200과 함께 JSON 응답이 반환되어 웹훅이 이벤트를 성공적으로 수신하고 처리했음을 나타냅니다.
  return NextResponse.json({ received: true }, { status: 200 });
}

//Stripe 웹훅은 Stripe API에서 발생하는 이벤트를 실시간으로 감지하고 처리하는 기능을 제공합니다. 이 코드는 웹훅으로부터 들어오는 요청을 처리하여 특정 Stripe 이벤트들을 감지하고 해당 이벤트에 따라 필요한 작업을 수행합니다.
