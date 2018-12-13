/** @jsx jsx */
import { Suspense, useState } from 'react'
import { jsx } from '@emotion/core'
import { navigate } from '@reach/router'
import Downshift from 'downshift'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Spinner from './Spinner'

const QUERY_SEARCH = gql`
  query searchCategoriesByItem($searchTerm: String!) {
    categories(where: { items_some: { title_contains: $searchTerm } }) {
      name
      slug
      items(where: { title_contains: $searchTerm }) {
        id
      }
    }
  }
`

function SearchItems(props) {
  const { search, getItemProps, highlightedIndex } = props
  const {
    data: { categories },
  } = useQuery(QUERY_SEARCH, {
    variables: { searchTerm: search },
  })

  return categories.map((item, index) => (
    <li
      key={item.slug}
      // css={{
      //   backgroundColor: highlightedIndex === index ? 'red' : 'transparent',
      // }}
    >
      <span>{item.items.length}</span> found in {item.name}
    </li>
  ))
}

function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  return (
    <div>
      <label htmlFor="searchInput">
        search
        <input
          value={value}
          onChange={event => setValue(event.target.value)}
          onFocus={() => setIsOpen(true)}
          type="search"
          id="searchInput"
        />
      </label>
      <ul>
        <Suspense fallback={<Spinner />}>
          {isOpen ? <SearchItems search={value} /> : null}
        </Suspense>
      </ul>
    </div>
  )
}

// function Search() {
//   return (
//     <Downshift
//       onChange={event => console.log(event)}
//       itemToString={item => (item ? item.slug : '')}
//     >
//       {({
//         getInputProps,
//         getItemProps,
//         getLabelProps,
//         getMenuProps,
//         isOpen,
//         inputValue,
//         highlightedIndex,
//         selectedItem,
//       }) => {
//         return (
//           <div>
//             <label {...getLabelProps()} htmlFor="searchInput">
//               search
//               <input {...getInputProps()} type="search" id="searchInput" />
//             </label>
//             <ul {...getMenuProps()}>
//               <Suspense fallback={<Spinner />}>
//                 {isOpen ? (
//                   <SearchItems
//                     highlightedIndex={highlightedIndex}
//                     getItemProps={getItemProps}
//                     search={inputValue}
//                   />
//                 ) : null}
//               </Suspense>
//             </ul>
//           </div>
//         )
//       }}
//     </Downshift>
//   )
// }

export default Search
