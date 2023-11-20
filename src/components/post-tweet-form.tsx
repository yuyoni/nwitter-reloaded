import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: 1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid 1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: 1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e?.target;
    if (files && files.length == 1) {
      if (files[0].size > 1024 * 1024) {
        alert("Only files less than 1MB can be uploaded.");
        return;
      } else {
        setFile(files[0]);
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setLoading(true);
      // Firebase SDK에 포함된 addDoc : 새로운 document를 생성해줌
      // 파라미터로 어떤 컬렉션에 document 생성할건지, 어떤 내용인지를 받음
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      // file은 필수가 아니므로 파일 첨부했는지 확인하고 file 첨부했을때 어떻게 할 지 따로 적어주기
      if (file) {
        // file위치에 대한 reference 받아야함 - 어디에 저장해줄지 직접 명시
        // storage에 저장할 때, tweets폴더 안에 user id 안에 문서 id안에 저장 (doc.id의 경우 addDoc함수가 생성된 document의 참초를 promise로 반환하기 때문에 아래와 같이 사용가능)
        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        );
        // uploadBytes는 위치와 file을 매개변수로 받아서 업로드 결과에 대한 참조를 promise로 반환함
        const result = await uploadBytes(locationRef, file);
        // 결과 url을 string으로 반환하는 getDownloadURL을 이용해 file의 url을 얻어서 화면에 표시
        const url = await getDownloadURL(result.ref);
        //updateDoc 함수를 이용해 어떤 문서를 업데이트 할지 작성 - 문서의 참조와 저장할 데이터를 파라미터로 넘겨주면됨
        await updateDoc(doc, {
          photo: url,
        });
      }
      // 업로드 하고나면 tweet 리셋해주기
      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="What is happening?"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo Added ✅ " : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post tweet"}
      />
    </Form>
  );
}
