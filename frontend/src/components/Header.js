/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useState, useRef, useEffect, Suspense } from 'react'
import { Link } from '@reach/router'
import { useUser } from './User'
import { Img } from 'the-platform'
import useFocus from '../lib/useFocus'
import SearchBar from './SearchBar'
import SpacerGif from './SpacerGif'
import Button, { UnstyledButton } from './elements/Button'

function Header(props) {
  const { user } = useUser()
  return (
    <header css={[styles.header, styles.flexWrapper]} {...props}>
      <div css={styles.logo}>
        <Link to="/">Logo</Link>
      </div>
      <SpacerGif />
      <SearchBar css={styles.searchBar} />
      <SpacerGif />
      <nav css={styles.navigation}>
        {user && (
          <MenuItem type="primary" to="/add-item">
            Add Item
          </MenuItem>
        )}
        <MenuItem to="/categories">Categories</MenuItem>
        {user && <MenuItem to="/profile">Dashboard</MenuItem>}
        {user && (
          <ProfileButton>
            <button>Sign Out</button>
          </ProfileButton>
        )}
        {!user && (
          <MenuItem type="primary" to="/profile">
            Sign in
          </MenuItem>
        )}
      </nav>
    </header>
  )
}

const styles = {
  header: css`
    height: 75px;
    padding: 0.5rem;
    border-bottom: 1px solid #ebeff0;
    background-color: white;
  `,
  flexWrapper: css`
    display: flex;
    align-items: center;
  `,
  logo: css`
    opacity: 0;
  `,
  searchBar: css`
    flex: 1 1 20%;
  `,
  navigation: css`
    display: flex;
    align-items: center;
  `,
  menuItem: {
    default: css`
      display: inline-flex;
      font-size: 0.9rem;
      text-decoration: none;
      margin: 0 0.5rem;
      color: #767677;
    `,
    primary: css`
      color: #22a3bb;
    `,
  },
}

function MenuItem({ type, ...props }) {
  const primary = type === 'primary'
  return (
    <Link
      css={[styles.menuItem.default, primary && styles.menuItem.primary]}
      {...props}
    />
  )
}

const profileStyle = {
  wrapper: css`
    display: inline-flex;
    position: relative;
  `,
  dropdown: css`
    background-color: white;
    padding: 1rem;
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 10rem;
    text-align: right;
    box-shadow: 1px 1px 20px hsla(0, 0%, 0%, 0.05),
      1px 1px 15px hsla(0, 0%, 0%, 0.025);
    z-index: 10;
  `,
  image: css`
    --image-dimension: 2.5rem;
    width: var(--image-dimension);
    height: var(--image-dimension);
    object-fit: cover;
    display: inline-flex;
    border-radius: 50%;
  `,
}

function ProfileButton(props) {
  const { user, signOut } = useUser()

  const [open, setOpen] = useState(false)
  const [hasFocus, onFocus, onBlur] = useFocus()
  useEffect(
    () => {
      if (open && !hasFocus) {
        setOpen(false)
      }
    },
    [onFocus]
  )

  const nav = useRef()
  useEffect(
    () => {
      if (open && nav.current) {
        nav.current.firstChild.focus()
      }
    },
    [open]
  )

  return (
    <div
      {...props}
      onFocus={onFocus}
      onBlur={onBlur}
      css={profileStyle.wrapper}
    >
      <UnstyledButton
        onClick={() => setOpen(!open)}
        css={styles.menuItem.default}
        aria-haspopup="true"
        aria-expanded={open && hasFocus}
        aria-label="open profile menu"
      >
        {user.image ? (
          <Suspense
            maxDuration={0}
            fallback={
              <img src={user.image.preview} alt="" css={profileStyle.image} />
            }
          >
            <Img src={user.image.full} alt="" css={profileStyle.image} />
          </Suspense>
        ) : (
          'Profile ▾'
        )}
      </UnstyledButton>
      {open && (
        <nav
          ref={nav}
          aria-label="profile-dropdown"
          css={profileStyle.dropdown}
        >
          <MenuItem to="/profile">My profile</MenuItem>
          <Button
            onClick={async () => {
              await signOut()
            }}
          >
            Sign out
          </Button>
        </nav>
      )}
    </div>
  )
}

export default Header
