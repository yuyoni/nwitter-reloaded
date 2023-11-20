import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  //useEffect를 사용해서 fetchTweets 호출
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    // fetchTweets 함수로 트윗 가져오기 - 함수 내부에는 어떤 트윗 가져올지 쿼리를 생성 후 문서 가져오는 것 작성하면 됨
    const fetchTweets = async () => {
      // 쿼리 생성
      const tweetsQuery = query(
        // 어떤 컬렉션 어떻게 가져올지
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        //최대 트윗 갯수 제한
        limit(25)
      );

      /* 
    // getDocs함수로 문서 가져오기 (getDocs는 promise로 QuerySnapShot을 결과값으로 받게 되므로 변수이름 snapshot)
    const snapshot = await getDocs(tweetsQuery);
    // 가져온 문서를 순환하면서 내부 데이터에 접근
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });*/

      // 위 처럼 getDocs를 사용하는 대신 실시간 처리를 위해 onSnapshot사용
      // onSnapshot함수는 unsubscribe함수를 반환함
      // 비용절약을 위한 쿼리제한 - 원치 않는 실시간 반영(비용문제 등)을 방지하기 위해 이벤트 리스너에 대한 구독을 취소하도록
      // useEffect 내부에 작성 (useEffect는 유저가 해당 컴포넌트를 보지 않을 때 값을 반환하면서 cleanup 기능을 실시하기 때문에 ex) 프로필 페이지에 있을때는 timeline 실시간 업데이트안함 )
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();
    // useEffect 훅의 teardown(cleanup)이 실행되면 unsubscibe() 함수 호출(구독취소)하도록 함
    return () => {
      // useEffect에서 값을 반환할 때, unsubscibe 값이 null이 아니라면 unsubscribe() 호출
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
