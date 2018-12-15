/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Fragment } from 'react'
import { useMutation } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import { Link } from '@reach/router'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuLink,
} from '@reach/menu-button'
import '@reach/menu-button/styles.css'
import { useUser } from './User'
import SpacerGif from './SpacerGif'
import { ButtonLink } from './elements/Button'

const style = {
  flexWrapper: css`
    display: flex;
    align-items: center;
    padding: 1rem;
  `,
  logo: css`
    background: tomato;
  `,
}

const MUTATION_SIGNOUT = graphql`
  mutation signOut {
    signOut {
      message
    }
  }
`

function Profile(props) {
  const signOut = useMutation(MUTATION_SIGNOUT)
  const { setUser } = useUser()
  return (
    <Menu>
      <MenuButton>Profile</MenuButton>
      <MenuList>
        <MenuItem
          onClick={async () => {
            await signOut()
            setUser(undefined)
          }}
        >
          Sign out
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

function Header(props) {
  const { user } = useUser()
  return (
    <header {...props}>
      <div css={style.flexWrapper}>
        <div css={style.logo}>Logo</div>
        <SpacerGif />
        <nav>
          {user && (
            <Fragment>
              <ButtonLink to="/add-item">Add Item</ButtonLink>
              <Profile>
                <button>Sign Out</button>
              </Profile>
            </Fragment>
          )}
          {!user && <Link to="/sign-in">Sign in</Link>}
        </nav>
      </div>
    </header>
  )
}

export default Header
