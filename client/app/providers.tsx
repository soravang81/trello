'use client';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { Toaster } from "sonner"
import dotenv from 'dotenv';
dotenv.config()

export const Providers = ({ children }: { children: React.ReactNode }) => {
  
  return (
      <RecoilRoot >
          <Toaster position='top-right' expand={false}/>
          {children}
      </RecoilRoot>
  );
};