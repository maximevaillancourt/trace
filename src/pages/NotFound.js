import React from 'react';
import { Link } from 'react-router-dom'

const NotFound = () =>
  <div>
    <h3>Page not found</h3>
    <p>
      <Link to={`/`}>
        Return to the home page
      </Link>
    </p>
  </div>

export default NotFound;