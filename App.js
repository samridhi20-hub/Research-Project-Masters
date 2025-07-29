// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;



// import React from 'react';
// import { Button, Container, Typography } from '@mui/material';

// function App() {
//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>
//         BioBERT Adverse Event Dashboard
//       </Typography>
//       <Button variant="contained" color="primary">
//         Upload CSV
//       </Button>
//     </Container>
//   );
// }

// export default App;


// import React from 'react';
// import { Container, Typography } from '@mui/material';
// import CSVUploader from './CSVUploader';

// function App() {
//   return (
//     <Container maxWidth="md" style={{ marginTop: '2rem' }}>
//       <Typography variant="h4" gutterBottom>
//         BioBERT Adverse Event Dashboard
//       </Typography>
//       <CSVUploader />
//     </Container>
//   );
// }

// export default App;






import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import CSVUploader from './CSVUploader';

function App() {
  const [results, setResults] = useState(null);
  const [loadingCount, setLoadingCount] = useState(0);

  const handleDataLoaded = async (rows) => {
    setResults(null);
    setLoadingCount(rows.length);

    const predictions = await Promise.all(rows.map(async (row) => {
      try {
        const resp = await fetch('/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: row.FOI_TEXT }),
        });
        const data = await resp.json();
        return {
          ...row,
          PREDICTION: data.prediction,
          CONFIDENCE: data.confidence,
        };
      } catch (err) {
        console.error(err);
        return { ...row, PREDICTION: 'Error', CONFIDENCE: 'N/A' };
      } finally {
        setLoadingCount(c => c - 1);
      }
    }));

    setResults(predictions);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        BioBERT Adverse Event Dashboard
      </Typography>
      <CSVUploader onDataLoaded={handleDataLoaded} results={results} />

      {results === null && loadingCount > 0 && (
        <Typography>Loading predictions… ({loadingCount} left)</Typography>
      )}
    </Container>
  );
}

export default App;
