import React from 'react';
import classNames from "classnames";
import Lottie from "react-lottie";
import {useDebounce} from "@reactuses/core";

interface FavoriteButtonProps {
  active: boolean;
  busy: boolean;

  onClick(): void;
}

function FavoriteButton({active, busy, onClick}: FavoriteButtonProps) {
  const debouncedBusy = useDebounce(busy, 250);
  return (
    <button
      type='button'
      onClick={onClick}
      className={classNames(
        'btn-primary',
        debouncedBusy ? 'animate-pulse' : ''
      )}
      disabled={debouncedBusy}
    >
      {debouncedBusy ? (
        <span className="w-8 opacity-25">
          <Lottie options={{
            loop: true,
            autoplay: true,
            animationData: require('../assets/json/spinner.json'),
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          }}/>
        </span>
      ) : (
        <i className={classNames(
          "mdi text-3xl",
          active ? 'mdi-star text-sky-300/50' : 'mdi-star-outline text-slate-400'
        )}></i>
      )}
      <span className={classNames(
        'text-sm text-slate-400',
        active ? 'font-bold' : 'font-medium'
      )}>
        {debouncedBusy ? 'Loading' : (active ? 'Added' : 'Add')}
      </span>
    </button>
  );
}

export default FavoriteButton;
