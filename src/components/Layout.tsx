import React from 'react';
import Header from './Header';

const Layout: React.FC = (props: React.PropsWithChildren) =>  {
  return (
    <div>
      <Header />
      {props.children}
    </div>
  );
  
}


export default Layout
