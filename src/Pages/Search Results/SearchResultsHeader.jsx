import React, { useState, useEffect } from 'react'
import styles from "./SearchResultsHeader.module.css";
import { useParams } from "react-router-dom"

const SearchResultsHeader = () => {
  const { query } = useParams();
  return (
    <div className={styles.container}>
      <h1>Search Results for:</h1>
      <h3>{ query }</h3>
    </div>
  )
}

export default SearchResultsHeader