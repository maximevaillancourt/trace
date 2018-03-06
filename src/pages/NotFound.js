import React from 'react';
import { Link } from 'react-router-dom'

const NotFound = () =>
  <div>
    <h3>Page non trouvée</h3>
    <p>
      <Link to={`/`}>
        Retourner à l'accueil
      </Link>
    </p>
  </div>

export default NotFound;