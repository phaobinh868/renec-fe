'use client';
import { gql_createShare } from "@/_gql-string/shares";
import { useSession } from "@/_providers/SessionProvider";
import { Share } from "@/_types/share";
import { useMutation } from "@apollo/client";
import { redirect, useRouter } from "next/navigation";
import { FormEvent, useEffect } from "react"
import { toast } from "react-toastify";

export default function SharePage() {
    const router = useRouter();
    const session = useSession();
    if (!session.user) return redirect("/");

    const [createShare, { data: createShareData }] = useMutation<{
        createShare: Share;
    }>(gql_createShare);
    useEffect(() => {
        if (!createShareData) return;
        const share = createShareData.createShare;
        toast.success(`"${share.title}" is shared`);
        router.push("/");
    }, [createShareData]);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget)
        createShare({
            variables: {
                input: {
                    url: formData.get("url")
                }
            }
        });
    }
    return <>
        <div className="d-flex align-items-center py-4 bg-body-tertiary " style={{
            height: "100vh"
        }}>
            <form className="m-auto p-3 card" onSubmit={onSubmit}>
                <h1 className="h3 mb-3 fw-normal px-4">Share a Youtube Movie</h1>
                <div className="mb-4">
                    <label htmlFor="url">Youtube URL</label>
                    <input name="url" type="text" className="form-control" id="url" placeholder="Youtube URL" />
                </div>
                <button className="btn btn-primary w-100 py-2" type="submit">Share</button>
            </form>
        </div>
    </>
}
