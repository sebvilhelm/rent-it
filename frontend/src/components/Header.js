/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Fragment, useState } from 'react'
import { Link } from '@reach/router'
import { useUser } from './User'
import SpacerGif from './SpacerGif'
import Button, { ButtonLink } from './elements/Button'

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

const profileStyle = {
  wrapper: css`
    display: inline-block;
    position: relative;
  `,
  dropdown: css`
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 10rem;
    text-align: right;
  `,
}

function ProfileButton(props) {
  const { signOut } = useUser()
  const [open, setOpen] = useState(false)
  return (
    <div css={profileStyle.wrapper}>
      <Button onClick={() => setOpen(!open)}>Profile</Button>
      {open && (
        <nav css={profileStyle.dropdown}>
          <div>
            <Link to="/profile/bookings">My bookings</Link>
          </div>
          <div>
            <Link to="/profile/pending-bookings">Pending bookings</Link>
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

function Header(props) {
  const { user } = useUser()
  return (
    <header {...props}>
      <div css={style.flexWrapper}>
        <div css={style.logo}>
          <Link to="/">Logo</Link>
        </div>
        <SpacerGif />
        <nav>
          {user && (
            <Fragment>
              <ButtonLink to="/add-item">Add Item</ButtonLink>
              <ProfileButton>
                <button>Sign Out</button>
              </ProfileButton>
            </Fragment>
          )}
          {!user && <Link to="/profile">Sign in</Link>}
        </nav>
      </div>
    </header>
  )
}

export default Header
