import * as React from 'react'
import { Link } from 'react-router-dom'

// prettier-ignore
import { HeaderStyled } from './Header.style'

export const HeaderView = () => {
  return (
    <HeaderStyled>
      <Link to="/">
        <img alt="neocash.io" src="images/logo.svg" />
      </Link>
    </HeaderStyled>
  )
}
