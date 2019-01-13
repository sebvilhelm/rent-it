/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useState } from 'react'
import { Link } from '@reach/router'
import { useUser } from './User'
import SearchBar from './SearchBar'
import SpacerGif from './SpacerGif'
import Button from './elements/Button'

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
  navigation: css``,
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
    display: inline-block;
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
}

function ProfileButton(props) {
  const { signOut } = useUser()
  const [open, setOpen] = useState(false)

  return (
    <div {...props} css={profileStyle.wrapper}>
      <Button onClick={() => setOpen(!open)}>Profile</Button>
      {open && (
        <nav aria-label="profile-dropdown" css={profileStyle.dropdown}>
          <div>
            <Link to="/profile">My profile</Link>
          </div>
          <div>
            <button
              onClick={async () => {
                await signOut()
              }}
            >
              Sign out
            </button>
          </div>
        </nav>
      )}
    </div>
  )
}

export default Header
