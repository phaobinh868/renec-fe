'use client';
import { gql_login } from '@/_gql-string/auth';
import { signIn, signOut, useSession } from '@/_providers/SessionProvider';
import { Session } from '@/_types/auth';
import { useMutation } from '@apollo/client';
import React from 'react';
interface Props {
    total: number,
    limit: number,
    page: number,
    onChange?: any
}
const Pagination = ({ total, limit, page, onChange }: Props) => {
    return <>
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className="page-item">
                    <a className="page-link" href="#" onClick={() => (page > 1 ? onChange(page - 1) : null)} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                {Object.keys([...Array(Math.ceil(total / limit))]).map((index: string) =>
                    Number(index) + 1 == page ?
                        <li key={index} className="page-item active" aria-current="page">
                            <a className="page-link" href="#"onClick={() => onChange(Number(index) + 1)}>{Number(index) + 1}</a>
                        </li> :
                        <li key={index} className="page-item"><a className="page-link" href="#" onClick={() => onChange(Number(index) + 1)}>{Number(index) + 1}</a></li>)}
                <li className="page-item">
                    <a className="page-link" href="#" onClick={() => (page < Math.ceil(total / limit) ? onChange(page + 1) : null)} aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </>;
}

Pagination.displayName = "Pagination";
export default Pagination;