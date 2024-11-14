import React from 'react';
import { Outlet } from 'react-router-dom';
import { isdarkAtom } from '../../../../types/atoms';

function OverSeas() {
  return (
    <>
      <div>OverSeas</div>
      <Outlet context={{ isdarkAtom }} />
    </>
  );
}

export default OverSeas;
