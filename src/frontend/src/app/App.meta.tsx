import React from 'react'
import { Helmet } from 'react-helmet'

export const AppMeta = () => (
  <Helmet>
    <title>Neocash.io</title>
    <meta name="description" content="Payment Links" />
    <meta property="og:title" content="neocash.io" />
    <meta property="og:url" content="https://neocash.io" />
    <meta property="og:site_name" content="neocash.io" />
    <meta property="og:type" content="article" />
    <meta property="og:description" content="neocash.io" />
    <meta property="og:image" content="/ogimage.png" />
  </Helmet>
)
