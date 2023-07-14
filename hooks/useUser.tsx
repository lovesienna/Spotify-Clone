import { useEffect, useState, createContext, useContext } from "react";
import {
  useUser as useSupaUser, // useUser를 useSupaUser로 가져옵니다.
  useSessionContext,
  User,
} from "@supabase/auth-helpers-react";

import { UserDetails, Subscription } from "@/types";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
// UserContext를 createContext를 사용하여 생성합니다.

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();
  // useSessionContext 훅을 사용하여 필요한 변수들을 가져옵니다.

  const user = useSupaUser();
  // useSupaUser 훅을 사용하여 사용자 정보를 가져옵니다.
  const accessToken = session?.access_token ?? null;
  // 세션에서 액세스 토큰을 가져옵니다. 없으면 null로 설정합니다.
  const [isLoadingData, setIsloadingData] = useState(false);
  // 데이터 로딩 상태를 관리하는 상태 변수를 정의하고 초기값을 false로 설정합니다.
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  // 사용자 상세 정보를 관리하는 상태 변수를 정의하고 초기값을 null로 설정합니다.
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  // 구독 정보를 관리하는 상태 변수를 정의하고 초기값을 null로 설정합니다.

  const getUserDetails = () => supabase.from("users").select("*").single();
  // 사용자 상세 정보를 가져오는 함수를 정의합니다.

  const getSubscription = () =>
    supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .single();
  // 구독 정보를 가져오는 함수를 정의합니다.

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      // 사용자가 있고, 데이터 로딩 중이 아니며, 사용자 상세 정보와 구독 정보가 없는 경우
      setIsloadingData(true);
      // 데이터 로딩 상태를 true로 설정합니다.

      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];
          // Promise.allSettled의 결과에서 사용자 상세 정보와 구독 정보를 가져옵니다.

          if (userDetailsPromise.status === "fulfilled")
            setUserDetails(userDetailsPromise.value.data as UserDetails);
          // 사용자 상세 정보가 성공적으로 완료되었을 경우 상태 변수에 저장합니다.

          if (subscriptionPromise.status === "fulfilled")
            setSubscription(subscriptionPromise.value.data as Subscription);
          // 구독 정보가 성공적으로 완료되었을 경우 상태 변수에 저장합니다.

          setIsloadingData(false);
          // 데이터 로딩 상태를 false로 설정합니다.
        }
      );
    } else if (!user && !isLoadingUser && !isLoadingData) {
      // 사용자가 없고, 사용자 로딩 중이 아니며, 데이터 로딩 중이 아닌 경우
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]);
  // useEffect를 사용하여 사용자 및 로딩 상태가 변경될 때마다 실행됩니다.

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription,
  };
  // 컨텍스트의 값으로 사용될 객체를 정의합니다.

  return <UserContext.Provider value={value} {...props} />;
  // UserContext.Provider로 컨텍스트를 제공합니다.
};

export const useUser = () => {
  const context = useContext(UserContext);
  // UserContext를 useContext를 사용하여 가져옵니다.

  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  // 컨텍스트가 정의되지 않은 경우 오류를 throw합니다.

  return context;
};
// useUser 커스텀 훅을 정의하여 UserContext를 사용하는 컴포넌트에서 사용할 수 있도록 합니다.

//이 코드는 @supabase/auth-helpers-react와 Supabase를 사용하여 사용자 인증과 관련된 로직을
//처리하는 React 컴포넌트와 훅을 정의합니다. UserContext를 생성하고, User 정보와 사용자 상세 정보,
//구독 정보 등을 관리하며, 필요한 데이터를 비동기적으로 가져오는 로직을 포함합니다. 또한, useUser라는
//커스텀 훅을 정의하여 UserContext를 사용하는 컴포넌트에서 사용할 수 있도록 합니다.
