import React, {MouseEventHandler, PropsWithChildren, useState} from 'react';
import classNames from "classnames";

type PageTemplateProps = PropsWithChildren<{
    renderHeader(toggleSidenav: MouseEventHandler<HTMLButtonElement>): JSX.Element;
    renderSidenav(): JSX.Element;
}>

function PageTemplate({children, renderHeader, renderSidenav}: PageTemplateProps) {

  const [sidenav, setSidenav] = useState(false);

  function onToggleSidenav() {
    setSidenav(!sidenav);
  }

  return (
    <div className="flex bg-slate-900 h-screen">
      <nav
        className={classNames(
          "fixed inset-y-0 z-20 lg:relative p-8 pr-0 transform transition ease-out duration-300",
          sidenav ? '' : '-translate-x-64 lg:translate-x-0 -ml-8 lg:ml-0 opacity-0 lg:opacity-100'
        )}
      >
        {renderSidenav()}
      </nav>

      <div
        onClick={onToggleSidenav}
        className={classNames(
          'lg:hidden fixed inset-0 z-10 transition ease-out duration-300 bg-slate-600/50',
          sidenav ? 'bg-slate-600/50 backdrop-blur-lg' : 'opacity-0 pointer-events-none'
        )}
      ></div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-5">
          {renderHeader(onToggleSidenav)}
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageTemplate;
