import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "@firebase/util";
import {
  Form,
  Error,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    // 만약 이름,이메일,비밀번호가 비어있거나 로딩중이면 kill the function
    if (loading || email === "" || password === "") return;
    try {
      setLoading(true);
      // signInWithEmailAndPassword는 이메일과 패스워드가 정확하면 사용자를 반환함
      await signInWithEmailAndPassword(auth, email, password);
      // redirect to the home page
      navigate("/");
    } catch (e) {
      // error가 FirebaseError객체의 에러이면 객체가 가지고있는 code, message를 보여주도록 설정
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Wrapper>
        <Title>Login to 𝕏</Title>
        <Form onSubmit={onSubmit}>
          <Input
            onChange={onChange}
            name="email"
            value={email}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            onChange={onChange}
            name="password"
            value={password}
            placeholder="Password"
            type="password"
            required
          />
          <Input type="submit" value={loading ? "Loading..." : "Login"} />
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>
          Don't have an account?{" "}
          <Link to="/create-account">Create one &rarr;</Link>
        </Switcher>
        <GithubButton />
      </Wrapper>
    </>
  );
}
