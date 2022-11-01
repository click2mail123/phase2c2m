
import '../styles/globals.css'
import '../styles/custom.css'

import Head from 'next/head'
import Layout from '../components/Layout/Layout'
import Header from '../components/Header/Header'
import { NavContextProvider } from '../components/Context/NavContextProvider'
import Homepage from '../components/Homepage/Homepage'
import useScrollRestoration from '../helper/useScrollRestoration'

const MyApp = (props) => {
  const { Component, pageProps, router } = props;
  useScrollRestoration(router);
  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Click2Mail Google Workspace App" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="shortcut icon" href="/images/favicon.png" />
        <title>Click2Mail</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration = "manual"`,
          }}
        />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://accounts.google.com/gsi/client" ></script>
      </Head>
      <NavContextProvider>
        <Header />
        <Layout>
          <Homepage {...pageProps} />
          <Component {...pageProps} />
        </Layout>
      </NavContextProvider>
    </>
  )
}

export default MyApp
