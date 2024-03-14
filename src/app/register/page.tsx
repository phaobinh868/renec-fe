'use client';
import { gql_register } from "@/_gql-string/auth";
import { signIn, useSession } from "@/_providers/SessionProvider";
import { Session } from "@/_types/auth";
import { useMutation } from "@apollo/client";
import { redirect } from "next/navigation";
import { FormEvent, useEffect } from "react";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const session = useSession();
  const [register, { data: registerData }] = useMutation<{
    register: Session;
  }>(gql_register);

  useEffect(() => {
    if (!registerData) return;
    const user = registerData.register;
    signIn(user);
    toast.success("Your account creted");
  }, [registerData]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    register({
      variables: {
        input: {
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password")
        }
      }
    });
  }
  if (session.user) return redirect("/");
  return <>
    <div className="d-flex align-items-center py-4" style={{
      height: "100vh"
    }}>
      <form className="m-auto p-3 card" onSubmit={onSubmit}>
        <h1 className="h3 mb-3 fw-normal px-4">Sign up your account</h1>
        <div className="mb-2">
          <label htmlFor="floatingName">Your name</label>
          <input name="name" type="text" className="form-control" id="floatingName" placeholder="Your name" />
        </div>
        <div className="mb-2">
          <label htmlFor="floatingEmail">Email address</label>
          <input name="email" type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" />
        </div>
        <div className="mb-4">
          <label htmlFor="floatingPassword">Password</label>
          <input name="password" type="password" className="form-control" id="floatingPassword" placeholder="Password" />
        </div>
        <button className="btn btn-primary w-100 py-2" type="submit">Register</button>
      </form>
    </div>
  </>
}
