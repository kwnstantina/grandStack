import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import CytoscapeComponent from 'react-cytoscapejs';
import gql from 'graphql-tag';

const GET_MOVIES = gql`
  query getMovies($skip: Int!, $limit: Int!) {
    movies(skip: $skip, limit: $limit) {
      title
      actors {
        name
      }
    }
  }
`;

const GET_MOVIE = gql`
query Movie{
  movies{
    title
  }
}

`

function App() {
  const [skip, setSkip] = useState(0);
  const limit = 10;
  const { loading, error, data, fetchMore } = useQuery(GET_MOVIE, {
    variables: { skip, limit }
  });

  const elements = [];

  if (data) {
    data.movies?.forEach((movie) => {
      elements.push({
        data: { id: movie.title, label: movie.title }
      });
      // movie.actors.forEach((actor) => {
      //   elements.push({
      //     data: { id: actor.name, label: actor.name }
      //   });
      //   elements.push({
      //     data: { source: actor.name, target: movie.title }
      //   });
      // });
    });
  }

  return (
    <div>
      {error && <p>Error: {error.message}</p>}
      <CytoscapeComponent 
        elements={elements} 
        style={{ width: '100%', height: '20vh' ,backgroundColor:'gray'}} 
      />
      {loading && <p>Loading...</p>}
      <button onClick={() => {
        fetchMore({
          variables: {
            skip: skip + limit,
            limit
          }
        });
        setSkip(skip + limit);
      }}>
        Load More
      </button>
    </div>
  );
}

export default App;
