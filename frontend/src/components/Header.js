/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useState } from 'react'
import { Link } from '@reach/router'
import { useUser } from './User'
import SpacerGif from './SpacerGif'
import Button from './elements/Button'

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

function Header(props) {
  const { user } = useUser()
  return (
    <header css={[styles.header, styles.flexWrapper]} {...props}>
      <div css={styles.logo}>
        <Link to="/">Logo</Link>
      </div>
      <SpacerGif />
      <SearchBar />
      <SpacerGif />
      <nav css={styles.navigation}>
        {user && (
          <MenuItem type="primary" to="/add-item">
            Add Item
          </MenuItem>
        )}
        <MenuItem to="/categories">Categories</MenuItem>
        <MenuItem to="/profile">Dashboard</MenuItem>
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
const searchStyles = {
  input: css`
    border: 0;
    background: #f5f5f5;
    padding: 0.5rem 1rem;
    width: 100%;
    max-width: 512px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 0.7rem;
    &::placeholder {
      color: #7d7f80;
    }
  `,
}
function SearchBar(props) {
  return <input css={searchStyles.input} placeholder="Search..." type="text" />
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
        <nav css={profileStyle.dropdown}>
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
