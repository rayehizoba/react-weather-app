import React, {PropsWithChildren} from 'react';
import classNames from "classnames";

interface CardProps {
  onClick?(): void;
  className?: string;
}

function Card({ children, className, onClick }: PropsWithChildren<CardProps>) {
  return (
    <div
      onClick={onClick}
      className={classNames('bg-slate-600/50 rounded-3xl', className)}
    >
      {children}
    </div>
  );
}

export default Card;
