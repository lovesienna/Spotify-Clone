"use client";

import { useState, useEffect } from "react";
import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import { ProductWithPrice } from "@/types";
import SubscribeModal from "@/components/SubscribeModal";

interface ModalProviderProps {
  products: ProductWithPrice[];
}

const ModalProvider: React.FC<ModalProviderProps> = ({ products }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <UploadModal />
      <SubscribeModal products={products} />
    </>
  );
};

export default ModalProvider;

//ModalProvider 컴포넌트는 AuthModal, UploadModal, SubscribeModal 등 다양한 모달 컴포넌트들을 묶어서 제공하는 역할을 합니다.
//ModalProvider 컴포넌트는 모달을 제공하는 컴포넌트입니다.
//products를 인자로 받아와서 SubscribeModal에 전달합니다.
//isMounted 상태를 사용하여 컴포넌트가 마운트되었는지 확인합니다.
//useEffect를 사용하여 컴포넌트가 마운트되면 isMounted를 true로 설정합니다.
//컴포넌트가 마운트된 후, AuthModal, UploadModal, SubscribeModal 컴포넌트를 렌더링합니다.
//SubscribeModal에는 products 정보를 전달하여 구독 모달을 초기화합니다.

//SubscribeModal은 구독 모달을 관리하고 products 정보를 받아와서 사용자가 구독하는 제품에 대한 처리를 수행합니다.
//이렇게 컴포넌트들이 계층적으로 구성되어 모듈화되면 코드의 유지 보수가 용이해지고, 각 컴포넌트의 역할이 분리되어 코드가 더 깔끔해집니다. 또한, 필요에 따라 모달 컴포넌트를 다른 페이지에서도 사용할 수 있으며, 컴포넌트의 재사용성이 높아집니다.
