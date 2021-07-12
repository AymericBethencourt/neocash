// prettier-ignore
import { LinkGrid, LinkInputGrid, LinkStyled } from './Link.style'
import { Button } from 'app/App.components/Button/Button.controller'
import { Input } from 'app/App.components/Input/Input.controller'
import axios from 'axios'
import * as React from 'react'
import { useLocation } from 'react-router'
import { subTextColor } from 'styles'
import { useDispatch } from 'react-redux'
import { showToaster } from 'app/App.components/Toaster/Toaster.actions'
import { SUCCESS, ERROR } from 'app/App.components/Toaster/Toaster.constants'
import { useState } from 'react'

// 0x89396e74e92994caae61ffea104bd01ad655ae98

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export const Link = () => {
  let query = useQuery()
  const username = query.get('username') || '(unknown)'
  let [url, setUrl] = React.useState('')
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  //0x333da375c2bac783276a953dd65028771e667e26

  async function linkUsername() {
    try {
      setLoading(true)
      //@ts-ignore
      const neolineN3 = new NEOLineN3.Init()

      const bal = await neolineN3.getBalance()
      if (Object.keys(bal).length <= 0) throw new Error('No address available')

      const scriptHash = await neolineN3.AddressToScriptHash({ address: Object.keys(bal)[0] })

      console.log(scriptHash)

      neolineN3
        .invoke({
          scriptHash: '0x333da375c2bac783276a953dd65028771e667e26',
          operation: 'changeAddress',
          args: [
            {
              type: 'ByteArray',
              value: 'test2',
            },
            {
              type: 'ByteArray',
              value: 'NhhNe4cEWS8tLtEnMyWAL9mxTx3Kvsqv9a',
            },
          ],
          fee: '0.01',
          broadcastOverride: false,
          signers: [
            {
              account: scriptHash.scriptHash,
              scopes: 1,
            },
          ],
        })
        .then((result: any) => {
          setLoading(false)
          setSent(true)
          dispatch(showToaster(SUCCESS, 'Account linked!', result.txid))
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

    // try {
    //   setLoading(true)
    //   const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/set-address`, {
    //     username,
    //     url,
    //   })
    //   console.log(response)
    //   setLoading(false)
    //   dispatch(showToaster(SUCCESS, 'DONE', 'Account linked'))
    // } catch (error) {
    //   setLoading(false)
    //   dispatch(showToaster(ERROR, error.message, ''))
    //   console.error(error)
    // }
  }

  return (
    <LinkStyled>
      <div>
        This user, <b>{username}</b>, has not yet linked an Neo N3 address to his account. If you are the owner of this
        account, you can link your Neo N3 address as follows:
      </div>

      <LinkGrid>
        <svg>
          <use xlinkHref="/icons/sprites.svg#twitter" />
        </svg>
        <div>
          To link your Twitter account, make a tweet with your Ethereum address pasted into the contents (surrounding
          text doesn't matter). Copy-paste the tweets URL into the above input box and fire away!
        </div>
      </LinkGrid>

      <LinkGrid>
        <svg>
          <use xlinkHref="/icons/sprites.svg#facebook" />
        </svg>
        <div>Comming soon... </div>
      </LinkGrid>

      <LinkGrid>
        <svg>
          <use xlinkHref="/icons/sprites.svg#youtube" />
        </svg>
        <div>Comming soon... </div>
      </LinkGrid>

      <LinkInputGrid>
        <Input
          icon="link"
          name="url"
          placeholder="URL of Tweet, Facebook post or Youtube video"
          type="text"
          onChange={(e) => {
            setUrl(e.target.value)
          }}
          value={url}
          onBlur={() => {}}
          inputStatus={undefined}
          errorMessage={undefined}
        />
        <Button
          type="button"
          text="Link"
          icon="address"
          loading={loading}
          onClick={() => linkUsername()}
          color={subTextColor}
        />
      </LinkInputGrid>
    </LinkStyled>
  )
}
