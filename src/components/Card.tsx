import React, {PropsWithChildren} from 'react';
import classNames from "classnames";

interface CardProps {
  className?: string;
  'data-testid'?: string;

  onClick?(): void;
}

function Card({ children, className, onClick, 'data-testid': dataTestId }: PropsWithChildren<CardProps>) {
  return (
    <div
      onClick={onClick}
      data-testid={dataTestId}
      className={classNames('bg-slate-600/50 rounded-3xl', className)}
    >
      {children}
    </div>
  );
}

export default Card;
