'use client'
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "./SessionProvider";
import { toast } from "react-toastify";

export const SocketContext = React.createContext<any>(null);

interface Props {
    children: ReactNode,
}
const SocketProvider = ({ children }: Props) => {
    const session = useSession();
    const socketRef = useRef<any>(null);
    const [socket, setSocket] = useState<any>(null);
    const onNewShare = (data: string) => {
        const share = JSON.parse(data);
        if(session.user?._id.toLowerCase() !== share.user._id.toLowerCase())
        toast.info(`"${share.title}" is shared by ${share.user.name}`);
    }
    useEffect(() => {
        function onConnect() { }
        function onDisconnect() { }
        if (session?.user) {
            socketRef.current = (typeof window !== `undefined`) ? io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
                autoConnect: true,
                query: { access_token: session.access_token }
            }) : undefined;
            socketRef.current.on("new_share", onNewShare);
        } else {
            socketRef.current?.disconnect();
            socketRef.current?.off('connect', onConnect);
            socketRef.current?.off('disconnect', onDisconnect);
            socketRef.current?.off('new_share', onNewShare);
            socketRef.current = null;
        }
        setSocket(socketRef.current);
        return () => {
            socketRef.current?.off('connect', onConnect);
            socketRef.current?.off('disconnect', onDisconnect);
            socketRef.current?.off('new_share', onNewShare);
        }
    }, [session]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
export default SocketProvider;