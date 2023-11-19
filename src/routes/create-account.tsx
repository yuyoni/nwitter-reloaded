import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "@firebase/util";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    // 만약 이름,이메일,비밀번호가 비어있거나 로딩중이면 kill the function
    if (loading || name === "" || email === "" || password === "") return;
    try {
      setLoading(true); // 임시
      // create user.
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // set the name of the user.
      await updateProfile(credentials.user, {
        displayName: name,
      });
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
        <Title>Join 𝕏</Title>
        <Form onSubmit={onSubmit}>
          <Input
            onChange={onChange}
            name="name"
            value={name}
            placeholder="Name"
            type="text"
            required
          />
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
          <Input
            type="submit"
            value={loading ? "Loading..." : "Create Account"}
          />
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>
          Already have an account? <Link to="/login">Log in &rarr;</Link>
        </Switcher>

        <GithubButton />
      </Wrapper>
    </>
  );
}
