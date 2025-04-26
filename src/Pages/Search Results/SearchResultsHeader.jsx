import React from 'react'
import styles from "./SearchResultsHeader.module.css";

const SearchResultsHeader = () => {
  return (
    <div className={styles.container}>
      <h1>Search Results for:</h1>
      <h3>Searched Words</h3>
      <hr />
    </div>
  )
}

export default SearchResultsHeader