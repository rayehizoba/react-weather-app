import React from 'react';
import classNames from "classnames";

interface FavoriteButtonProps {
  active: boolean;
  busy: boolean;

  onClick(): void;
}

function FavoriteButton({active, busy, onClick}: FavoriteButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={classNames(
        'btn-primary',
        busy ? 'opacity-50' : ''
      )}
      disabled={busy}
    >
      <i className={classNames(
        "mdi text-3xl",
        active ? 'mdi-star text-sky-300/50' : 'mdi-star-outline text-slate-400'
      )}></i>
      <span className={classNames(
        'text-sm text-slate-400',
        active ? 'font-bold' : 'font-medium'
      )}>
        {active ? 'Added' : 'Add'}
      </span>
    </button>
  );
}

export default FavoriteButton;
