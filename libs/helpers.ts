import { Price } from "@/types";

//사이트 URL을 반환하는 함수입니다.
export const getURL = () => {
  let url =
    //
    process?.env?.NEXT_PUBLIC_SITE_URL ?? //환경 변수 NEXT_PUBLIC_SITE_URL의 값이 있으면 해당 값을 사용합니다. 이는 프로덕션 환경에서 설정될 수 있는 사이트 URL을 의미
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? //만약 NEXT_PUBLIC_SITE_URL이 없는 경우, Vercel 서비스에서 자동으로 설정되는 NEXT_PUBLIC_VERCEL_URL을 사용
    "http://localhost:3000/"; //Vercel 외의 환경 또는 로컬 개발 환경에서는 "http://localhost:3000/"를 기본 URL로 사용합니다.
  // Make sure to include `https://` when not localhost.
  //만약 URL에 "http"가 포함되어 있지 않으면, "https://"를 붙여줍니다.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  //URL의 마지막에 슬래시(/)가 없으면 슬래시를 추가해줍니다.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

  //최종적으로 URL을 반환합니다.
  return url;
};

//주어진 URL에 데이터를 POST하는 함수입니다.
export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: { price: Price };
}) => {
  console.log("posting,", url, data);

  //url 인자로 전달된 URL에 POST 요청을 보내고, data 인자로 전달된 데이터를 JSON 형태로 요청 본문에 담아 보냅니다.
  const res: Response = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    //credentials 속성을 "same-origin"으로 설정하여 동일 출처(CORS) 요청을 수행합니다.
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("Error in postData", { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

//주어진 Unix 시간(초 단위)을 Date 객체로 변환하는 함수입니다.
//secs 인자로 전달된 Unix 시간(초 단위)을 이용하여 Date 객체를 생성합니다.
export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

//이러한 유틸리티 함수들은 주로 프론트엔드에서 사용되며, 웹 애플리케이션에서 사이트 URL을 설정하거나 데이터를 서버로 전송하는데 활용될 수 있습니다.
