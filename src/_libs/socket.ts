import { io } from 'socket.io-client';

export default (typeof window !== `undefined`)?io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  autoConnect: true
}):undefined;