"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

import useSubscribeModal from "@/hooks/useSubscribeModal";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import { Price, ProductWithPrice } from "@/types";

import Modal from "./Modal";
import Button from "./Button";

// SubscribeModalProps 인터페이스 정의
interface SubscribeModalProps {
  products: ProductWithPrice[]; // 모달에서 사용할 상품 목록을 포함하는 배열
}

// price를 화폐 형식으로 변환하는 함수
const formatPrice = (price: Price) => {
  // 화폐 형식 지정
  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100); // 가격을 화폐 단위로 변환하여 문자열로 반환

  return priceString;
};

// SubscribeModal 컴포넌트 정의
const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  // useSubscribeModal 훅을 사용하여 모달 상태를 관리
  const subscribeModal = useSubscribeModal();

  // useUser 훅을 사용하여 유저 정보를 가져옴
  const { user, isLoading, subscription } = useUser();

  // 현재 가격 ID 로딩 상태를 관리하기 위한 상태와 상태 변경 함수
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  // 모달 상태가 변경될 때 호출되는 콜백 함수
  const onChange = (open: boolean) => {
    if (!open) {
      // 모달이 닫힐 때 모달 상태를 업데이트하여 모달을 닫음
      subscribeModal.onClose();
    }
  };

  // 구독 결제를 처리하는 함수
  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id); // 가격 ID 로딩 상태를 업데이트하여 로딩 중임을 표시

    if (!user) {
      // 유저가 로그인되지 않았을 경우 오류 메시지를 토스트로 표시하고 가격 ID 로딩 상태를 초기화
      setPriceIdLoading(undefined);
      return toast.error("Must be logged in");
    }

    if (subscription) {
      // 이미 구독 중인 경우 오류 메시지를 토스트로 표시하고 가격 ID 로딩 상태를 초기화
      setPriceIdLoading(undefined); //불리언 값이 아니기때문에 false 대신 언디파인드 쓰셈.
      return toast("Already subscribed");
    }

    try {
      // 서버에 결제 세션 생성을 요청하는 함수를 호출하여 결제 세션 ID를 가져옴
      const { sessionId } = await postData({
        url: "/api/create-checkout-session", // 결제 세션을 생성하는 API 엔드포인트
        data: { price }, // 선택한 가격 정보를 전달
      });

      // Stripe 객체를 가져와서 결제 페이지로 이동시키는 함수 호출
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      // 오류가 발생하면 오류 메시지를 토스트로 표시
      return toast.error((error as Error)?.message);
    } finally {
      // 처리가 완료되면 가격 ID 로딩 상태를 초기화
      setPriceIdLoading(undefined);
    }
  };

  // 컨텐츠 내용을 저장할 변수를 초기화
  let content = <div className="text-center">No products available.</div>;

  // 상품이 존재할 경우 컨텐츠 내용을 해당 상품들로 설정
  if (products.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length) {
            return <div key={product.id}>No prices available</div>;
          }

          return product.prices.map((price) => (
            <Button
              key={price.id}
              onClick={() => handleCheckout(price)} // 결제 버튼 클릭 시 handleCheckout 함수 호출
              disabled={isLoading || price.id === priceIdLoading} // 로딩 중이거나 현재 가격 ID 로딩 상태일 경우 버튼 비활성화
              className="mb-4"
            >
              {/* 구독 버튼 텍스트 설정 */}
              {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
            </Button>
          ));
        })}
      </div>
    );
  }

  // 이미 구독 중인 경우 컨텐츠 내용을 변경
  if (subscription) {
    content = <div className="text-center">Already subscribed.</div>;
  }

  // Modal 컴포넌트를 사용하여 모달을 렌더링
  return (
    <Modal
      title="Only for premium users"
      description="Listen to music with Spotify Premium"
      isOpen={subscribeModal.isOpen}
      onChange={onChange} // 모달 상태 변경 시 콜백 함수 호출
    >
      {content} {/* 컨텐츠 내용 렌더링 */}
    </Modal>
  );
};

export default SubscribeModal; // SubscribeModal 컴포넌트를 내보냄
