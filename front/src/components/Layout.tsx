// components/layout.js

import { useAppDispatch, useAppSelector } from "src/store/hook";
import Header from "./Header";
import React from "react";
import { change } from "src/store/slices/viewSlice";
import { useRouter } from "next/router";
import Head from "next/head";

type LayoutProps = {
    children: React.ReactNode,
};

export default function Layout({children}: LayoutProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const routeName = router.route.split('/')[1]
  const view = useAppSelector(state => state.view)

  React.useEffect(() => {
    if (!view) {
      dispatch(change())
    }
  }, [dispatch, view])

  return (
    <>
      <Head>
        <title>EpicRoadTrip | { routeName.replace(routeName.charAt(0), routeName.charAt(0).toUpperCase()) }</title>
      </Head>
      <Header />
      <main>{children}</main>
    </>
  )
}