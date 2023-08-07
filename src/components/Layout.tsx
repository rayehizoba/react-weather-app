import React, {PropsWithChildren} from 'react';
import Card from "./Card";
import classNames from "classnames";

interface LayoutProps {

}

function Layout({}: PropsWithChildren<LayoutProps>) {
  return (
    <div></div>
  );
}

export default Layout;

Layout.Menu = function () {
  return (
    <nav className="p-8 pr-0">
      <Card className='w-64 h-full p-3 overflow-y-auto'>
        <ul className='px-3'>
          {Array(4).fill(null).map((_, index, arr) => (
            <li
              className={classNames('relative', (index < arr.length - 1) && index !== 0 && 'border-b border-slate-600')}
              key={index}>
              <a href="#"
                 className={classNames('absolute inset-0 rounded-2xl -mx-3', index === 0 && 'bg-sky-200/25')}>
              </a>
              <div className="space-y-2 py-2">
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold text-sm">My Location</div>
                    <div className="text-xs font-bold text-slate-500">4:30 PM</div>
                  </div>
                  <div className="text-3xl text-slate-500">
                    24°
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="font-bold text-xs text-slate-500">Sunny</div>
                  <div className="font-bold text-xs text-slate-600">H:30° L:14°</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </nav>
  );
}
