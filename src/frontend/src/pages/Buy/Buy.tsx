import { showToaster } from 'app/App.components/Toaster/Toaster.actions'
import { ERROR, SUCCESS } from 'app/App.components/Toaster/Toaster.constants'
import axios from 'axios'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { useAxios } from 'use-axios-client'

import { BuyMeta } from './Buy.meta'
// prettier-ignore
import { Bar, BuyAddress, BuyAmount, BuyButton, BuyCurrency, BuyDescription, BuyDollar, BuyGrid, BuyInputs, BuyStyled, BuyTitle, LinkAddress, UploaderImage } from './Buy.style'

// http://localhost:3000/buy?address=NhhNe4cEWS8tLtEnMyWAL9mxTx3Kvsqv9a&currency=GAS&amount=1&title=Powdur&description=Test%20description&image=https://hub.textile.io/thread/bafkv4t2uqgblrc2gsgjrgc7gg2hthcu5jhnedx46gfpjj3axe6ahtuy/buckets/bafzbeig3vsanyp6xhzyduubyqh3zas4qapbc7hv75lxsngwrxxlnvfgtli/payment-links-powdur%20(1).jpg

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export const Buy = () => {
  let query = useQuery()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [address, setAddress] = useState(query.get('address') || undefined)
  const dispatch = useDispatch()

  const currency = query.get('currency') || 'No currency'
  const amount = query.get('amount') || 'No amount'
  const title = query.get('title') || 'No title'
  const description = query.get('description') || 'No description'
  const image = query.get('image') || undefined
  const twitter = query.get('twitter') || undefined
  const facebook = query.get('facebook') || undefined
  const youtube = query.get('youtube') || undefined

  const { data } = useAxios({
    url: `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${currency}&tsyms=USDT`,
  })

  const username = twitter || facebook || youtube

  // TODO: implement for all pairs
  // @ts-ignore
  const rate = data && data.RAW && data.RAW[currency] ? data.RAW[currency].USDT.PRICE : 0

  // useEffect(() => {
  //   window.addEventListener('NEOLine.N3.EVENT.READY', () => {
  //     console.log('N33333333')
  //     //@ts-ignore
  //     const neolineN3 = new NEOLineN3.Init()
  //     neolineN3.getBalance().then((result: any) => console.log(result))
  //   })
  //   //@ts-ignore
  // }, [])

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  useEffect(() => {
    async function getAddress() {
      try {
        setLoading(true)

        await sleep(3000)

        //@ts-ignore
        const neolineN3 = new NEOLineN3.Init()

        const bal = await neolineN3.getBalance()
        if (Object.keys(bal).length <= 0) throw new Error('No address available')

        const scriptHash = await neolineN3.AddressToScriptHash({ address: Object.keys(bal)[0] })

        console.log(scriptHash)

        // neolineN3
        //   .invoke({
        //     scriptHash: '0x333da375c2bac783276a953dd65028771e667e26',
        //     operation: 'getAddress',
        //     args: [
        //       {
        //         type: 'ByteArray',
        //         value: 'test2',
        //       },
        //     ],
        //     fee: '0.01',
        //     broadcastOverride: false,
        //     signers: [
        //       {
        //         account: scriptHash.scriptHash,
        //         scopes: 1,
        //       },
        //     ],
        //   })
        //   .then((result: any) => {
        //     setLoading(false)
        //     console.log(result)
        //     dispatch(showToaster(SUCCESS, 'Account found!', result.txid))
        //   })
        neolineN3
          .getStorage({
            scriptHash: '0x333da375c2bac783276a953dd65028771e667e26',
            key: 'ContractStorage',
          })
          .then((result: any) => {
            const value = result
            console.log('Storage value: ' + value)
          })
          .catch(({ type, description, data }: any) => {
            dispatch(showToaster(ERROR, type, description))
            setLoading(false)
            console.log({ type, description, data })
            switch (type) {
              case 'NO_PROVIDER':
                console.log('No provider available.')
                break
              case 'RPC_ERROR':
                console.log('There was an error when broadcasting this transaction to the network.')
                break
              case 'MALFORMED_INPUT':
                console.log('The receiver address provided is not valid.')
                break
              case 'CANCELED':
                console.log('The user has canceled this transaction.')
                break
              case 'INSUFFICIENT_FUNDS':
                console.log('The user has insufficient funds to execute this transaction.')
                break
            }
          })
      } catch (e) {
        setLoading(false)
        dispatch(showToaster(ERROR, 'Please install Neoline', e.message))
      }
    }

    if (username) getAddress()
  }, [])

  const pay = async () => {
    try {
      setLoading(true)
      //@ts-ignore
      const neolineN3 = new NEOLineN3.Init()

      const bal = await neolineN3.getBalance()
      if (Object.keys(bal).length <= 0) throw new Error('No address available')

      neolineN3
        .send({
          fromAddress: Object.keys(bal)[0],
          toAddress: address,
          asset: currency,
          amount,
          fee: '0.01',
          broadcastOverride: false,
        })
        .then((result: any) => {
          setLoading(false)
          setSent(true)
          dispatch(showToaster(SUCCESS, 'Send transaction success!', result.txid))
        })
        .catch(({ type, description, data }: any) => {
          dispatch(showToaster(ERROR, type, description))
          setLoading(false)
          setSent(false)
          switch (type) {
            case 'NO_PROVIDER':
              console.log('No provider available.')
              break
            case 'RPC_ERROR':
              console.log('There was an error when broadcasting this transaction to the network.')
              break
            case 'MALFORMED_INPUT':
              console.log('The receiver address provided is not valid.')
              break
            case 'CANCELED':
              console.log('The user has canceled this transaction.')
              break
            case 'INSUFFICIENT_FUNDS':
              console.log('The user has insufficient funds to execute this transaction.')
              break
          }
        })
    } catch (e) {
      setLoading(false)
      setSent(false)
      dispatch(showToaster(ERROR, 'Please install Neoline', e.message))
    }
  }

  return (
    <BuyStyled>
      <BuyMeta
        address={address}
        currency={currency}
        amount={amount}
        title={title}
        description={description}
        image={image}
      />

      {image && (
        <UploaderImage>
          <img src={image} />
        </UploaderImage>
      )}

      <BuyInputs>
        <BuyTitle>{title}</BuyTitle>

        <BuyDescription>{description}</BuyDescription>

        <BuyGrid>
          <Bar />
          <BuyAmount>{amount}</BuyAmount>
          <BuyCurrency>{currency}</BuyCurrency>
          <Bar />
        </BuyGrid>

        <BuyDollar>{`($${(parseFloat(amount) * rate).toFixed(2)})`}</BuyDollar>

        {address ? (
          <BuyAddress>Send to {address}</BuyAddress>
        ) : (
          <LinkAddress>
            This user <b>{username}</b> has not linked an Neo N3 address yet.
            <br />
            If this is you, you can{' '}
            <Link to={`/link?username=${username}`}>
              <u>link your address now</u>
            </Link>
            .
          </LinkAddress>
        )}
      </BuyInputs>

      <BuyButton type="button" loading={loading} sent={sent} onClick={() => pay()}>
        <span>
          <svg>
            <use xlinkHref="/icons/sprites.svg#neoline" />
          </svg>
          <svg>
            <use xlinkHref="/icons/sprites.svg#loader" />
          </svg>
          <svg>
            <use xlinkHref="/icons/sprites.svg#check" />
          </svg>
        </span>

        <ul>
          <li>Pay with Neoline</li>
          <li>Payment in progress</li>
          <li>Payment sent!</li>
        </ul>
      </BuyButton>
    </BuyStyled>
  )
}
