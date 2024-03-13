'use client';
import { gql_login } from '@/_gql-string/auth';
import { signIn, signOut, useSession } from '@/_providers/SessionProvider';
import { Session } from '@/_types/auth';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import React, { FormEvent, useEffect } from 'react';
import { toast } from 'react-toastify';

const Header = () => {
    const session = useSession();
    const [login, { data: loginData }] = useMutation<{
        login: Session;
    }>(gql_login);
    useEffect(() => {
        if (!loginData) return;
        const user = loginData.login;
        signIn(user);
        toast.success("Logged in");
    }, [loginData]);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        login({
            variables: {
                input: {
                    email: formData.get("email"),
                    password: formData.get("password"),
                }
            }
        });
    }
    return <>
        <header data-bs-theme="dark">
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" href="/">Funny Movies</Link>
                    {session?.user ? <div className='d-flex align-items-center'>
                        <div className='text-white me-2'>Welcome, {session.user.email}</div>
                        <Link className="btn btn-primary me-2" href="/share">Share a Movie</Link>
                        <button className="btn btn-outline-secondary" onClick={() => signOut()}>Logout</button>
                    </div> : <form className="d-flex" onSubmit={onSubmit}>
                        <input name="email" className="form-control me-2" type="email" placeholder="Email" aria-label="Email" />
                        <input name="password" className="form-control me-2" type="password" placeholder="Password" aria-label="Password" />
                        <button className="btn btn-primary me-2" type="submit">Login</button>
                        <Link className="btn btn-outline-secondary" href="/register">Register</Link>
                    </form>}
                </div>
            </nav>
        </header>
    </>;
}

Header.displayName = "Header";
export default Header;