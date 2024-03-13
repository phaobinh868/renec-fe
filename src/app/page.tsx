'use client';

import { gql_getShares } from "@/_gql-string/shares";
import { Share } from "@/_types/share";
import { useLazyQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import Image from 'next/image'
import Pagination from "@/_components/pagination";
import Link from "next/link";
import { SocketContext } from "@/_providers/SocketProvider";

export default function HomePage() {
  const [getShares, { data }] = useLazyQuery<{
    getShares: {
      total: number,
      data: Share[]
    };
  }>(gql_getShares);
  const socket = useContext(SocketContext);
  const [shares, setShares] = useState<Share[]>([])
  const [total, setTotal] = useState<number>(0)

  const [query, setQuery] = useState({
    limit: 12,
    page: 1
  });
  useEffect(() => {
    getShares({
      variables: {
        input: {
          ...query,
          sort: {
            created_at: -1
          }
        }
      }, fetchPolicy: 'network-only'
    });
  }, [query]);
  useEffect(() => {
    setShares(data?.getShares?.data ?? []);
    setTotal(data?.getShares?.total ?? 0);
  }, [data]);

  const onNewShare = (data: string) => {
    const share: Share = JSON.parse(data);
    setShares((shares) => [share, ...shares]);
    setTotal((total) => total + 1);
  }
  useEffect(() => {
    if (!socket) return;
    socket.on("new_share", onNewShare);
    return () => {
      socket.off("new_share", onNewShare);
    };
  }, [socket]);
  return <>
    {shares.map((share: Share) =>
      <div key={share._id} className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
        <div className="col-md-5">
          <Link href={`https://www.youtube.com/watch?v=${share.video_id}`} target="_blank">
            <Image src={share.thumbnail as string} className="share-thumbnail" alt={share.title as string} width={500} height={500} />
          </Link>
        </div>
        <div className="col-md-7 p-3 d-flex flex-column position-static">
          <Link href={`https://www.youtube.com/watch?v=${share.video_id}`} target="_blank">
            <h4 className="mb-0 share-title-truncate">{share.title}</h4>
          </Link>
          <div className="mb-0 text-body-secondary"><i>Shared by: {share.user?.name}</i></div>
          <p className="mb-auto share-description-truncate">{share.description}</p>
        </div>
      </div>)}
    {total?<Pagination total={total} page={query.page} limit={query.limit} onChange={(page: number) => setQuery({ ...query, page: page })} />:null}
  </>
}
