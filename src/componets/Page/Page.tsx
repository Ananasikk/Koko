import { ReactNode } from 'react';
import './Page.css';

export const Page = (props: { title: string, children: ReactNode }) => {

    return (
        <div className="page">
            <div className="page__title">
                {props.title}
            </div>
            <div className="page__content">
                {props.children}
            </div>
        </div>
    );
};
