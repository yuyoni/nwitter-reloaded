import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

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
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  // fetchTweets 함수로 트윗 가져오기 - 함수 내부에는 어떤 트윗 가져올지 쿼리를 생성 후 문서 가져오는 것 작성하면 됨
  const fetchTweets = async () => {
    // 쿼리 생성
    const tweetsQuery = query(
      // 어떤 컬렉션 어떻게 가져올지
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    );

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
    });
    setTweets(tweets);
  };

  //useEffect를 사용해서 fetchTweets 호출
  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
