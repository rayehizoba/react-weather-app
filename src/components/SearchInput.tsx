import React, {Fragment, useEffect, useRef, useState} from 'react';
import {useClickOutside, useDebounce} from "@reactuses/core";
import {LocationResource, SearchResponseData} from "../lib/types";
import {Menu, Transition} from "@headlessui/react";
import Lottie from "react-lottie";

interface SearchInputProps {
  busy: boolean;

  onChange(location: LocationResource): void;
}

function SearchInput({busy, onChange}: SearchInputProps) {
  const [fetch, setFetch] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value, 250);
  const debouncedFetch = useDebounce(fetch, 250);

  const [results, setResults] = useState<LocationResource[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedValue.length > 1) {
      const url = 'https://geocoding-api.open-meteo.com/v1/search?name=' + debouncedValue;

      fetchStart();
      window.fetch(url)
        .then((response) => {
          fetchFulfilled();
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data: SearchResponseData) => {
          if (Array.isArray(data.results)) {
            setResults(data.results);
            setOpen(true);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [debouncedValue]);

  useClickOutside(modalRef, () => {
    setOpen(false);
  });

  function fetchStart() {
    setFetch(true);
  }

  function fetchFulfilled() {
    setFetch(false);
  }

  function onClickItem(item: LocationResource) {
    return () => {
      onChange(item)
      setOpen(false);
      setValue('');
    }
  }

  return (
    <Menu ref={modalRef}>
      <div className="sm:relative z-[5] flex-1 md:flex-none">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pointer-events-none grid place-content-center px-1.5">
            {debouncedFetch || busy ? (
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
              <i className="mdi mdi-magnify text-3xl text-slate-400"></i>
            )}
          </div>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            className='w-full pl-10 rounded-full bg-slate-600/50 text-slate-400 font-medium p-2 focus:ring focus:ring-sky-300/25 outline-none transition'
            placeholder='Search'
          />
        </div>
        <Transition
          show={open}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div
            className="max-h-[24rem] overflow-y-auto origin-top-right absolute left-0 sm:left-auto right-0 top-100 mt-1 bg-slate-700 sm:min-w-[15rem] sm:max-w-lg lg:max-w-xl rounded-2xl overflow-hidden shadow-xl">
            <Menu.Items
              static
              className="p-1 focus:outline-none flex flex-col">
              <Menu.Item>
                <div className='bg-slate-700 z-10 sticky top-1 p-2 px-3 text-xs font-semibold text-white/50'>
                  Search Results
                </div>
              </Menu.Item>
              {results.map(item => (
                <Menu.Item key={item.id}>
                  <div
                    onClick={onClickItem(item)}
                    className="whitespace-nowrap text-ellipsis overflow-hidden p-3 py-1 cursor-pointer hover:bg-sky-200/25 transition rounded-xl font-medium">
                    {item.name}{Boolean(item.admin1) && ', ' + item.admin1}{Boolean(item.country) && ', ' + item.country}
                  </div>
                </Menu.Item>
              ))}
            </Menu.Items>
          </div>
        </Transition>
      </div>
    </Menu>
  );
}

export default SearchInput;
