// import React, { useState, useEffect } from 'react';
// import {
//   Button,
//   Typography,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Paper,
//   TablePagination,
//   TextField,
//   Checkbox,
//   FormGroup,
//   FormControlLabel,
//   Slider,
//   Box
// } from '@mui/material';
// import Papa from 'papaparse';

// function CSVUploader() {
//   const [originalData, setOriginalData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // Filter states
//   const [adverseChecked, setAdverseChecked] = useState(true);
//   const [nonAdverseChecked, setNonAdverseChecked] = useState(true);
//   const [confidenceRange, setConfidenceRange] = useState([0.0, 1.0]);
//   const [keyword, setKeyword] = useState('');

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (results) => {
//         setOriginalData(results.data);
//         setPage(0);
//       },
//     });
//   };

//   useEffect(() => {
//     // Apply filters
//     const filtered = originalData.filter((row) => {
//       const prediction = row.PREDICTION?.toLowerCase();
//       const confidence = parseFloat(row.CONFIDENCE || 0);
//       const text = row.FOI_TEXT?.toLowerCase() || "";

//       const labelMatch =
//         (adverseChecked && prediction === 'adverse') ||
//         (nonAdverseChecked && prediction === 'not adverse');

//       const confidenceMatch =
//         confidence >= confidenceRange[0] && confidence <= confidenceRange[1];

//       const keywordMatch = text.includes(keyword.toLowerCase());

//       return labelMatch && confidenceMatch && keywordMatch;
//     });

//     setFilteredData(filtered);
//   }, [originalData, adverseChecked, nonAdverseChecked, confidenceRange, keyword]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <div>
//       <Typography variant="h6" gutterBottom>
//         Upload a CSV File
//       </Typography>

//       <Button variant="contained" component="label">
//         Choose File
//         <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
//       </Button>

//       {/* FILTERS */}
//       {originalData.length > 0 && (
//         <Box mt={4} mb={2}>
//           <Typography variant="subtitle1">Filters</Typography>
//           <FormGroup row>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={adverseChecked}
//                   onChange={() => setAdverseChecked(!adverseChecked)}
//                 />
//               }
//               label="Adverse"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={nonAdverseChecked}
//                   onChange={() => setNonAdverseChecked(!nonAdverseChecked)}
//                 />
//               }
//               label="Not Adverse"
//             />
//           </FormGroup>

//           <Box mt={2} width={300}>
//             <Typography gutterBottom>Confidence Range</Typography>
//             <Slider
//               value={confidenceRange}
//               min={0}
//               max={1}
//               step={0.01}
//               onChange={(e, newValue) => setConfidenceRange(newValue)}
//               valueLabelDisplay="auto"
//             />
//           </Box>

//           <Box mt={2}>
//             <TextField
//               label="Search by Keyword (FOI_TEXT)"
//               variant="outlined"
//               size="small"
//               value={keyword}
//               onChange={(e) => setKeyword(e.target.value)}
//               fullWidth
//             />
//           </Box>
//         </Box>
//       )}

//       {/* TABLE */}
//       {filteredData.length > 0 && (
//         <Paper style={{ marginTop: '20px', overflowX: 'auto' }}>
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 {Object.keys(filteredData[0]).map((key) => (
//                   <TableCell key={key}>{key}</TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredData
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((row, idx) => (
//                   <TableRow key={idx}>
//                     {Object.values(row).map((val, i) => (
//                       <TableCell key={i}>{val}</TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>

//           <TablePagination
//             component="div"
//             count={filteredData.length}
//             page={page}
//             onPageChange={handleChangePage}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             rowsPerPageOptions={[5, 10, 25, 50]}
//           />
//         </Paper>
//       )}
//     </div>
//   );
// }

// export default CSVUploader;










import React, { useState, useEffect } from 'react';
import {
  Button, Typography, Table, TableHead, TableBody, TableRow,
  TableCell, Paper, TablePagination, TextField, Checkbox,
  FormGroup, FormControlLabel, Slider, Box
} from '@mui/material';
import Papa from 'papaparse';

function CSVUploader({ onDataLoaded, results }) {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [adverseChecked, setAdverseChecked] = useState(true);
  const [nonAdverseChecked, setNonAdverseChecked] = useState(true);
  const [confidenceRange, setConfidenceRange] = useState([0.0, 1.0]);
  const [keyword, setKeyword] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        setOriginalData(res.data);
        setPage(0);
        onDataLoaded(res.data);
      },
    });
  };

  useEffect(() => {
    const dataToFilter = results || originalData;
    const filtered = dataToFilter.filter(row => {
      const pred = (row.PREDICTION || row.PREDICTION === 0 ? row.PREDICTION : '').toString().toLowerCase();
      const conf = parseFloat(row.CONFIDENCE || 0);
      const text = (row.FOI_TEXT || '').toLowerCase();

      const labelMatch =
        (adverseChecked && pred === 'adverse event'.toLowerCase()) ||
        (nonAdverseChecked && pred === 'not adverse'.toLowerCase());

      const confMatch = conf >= confidenceRange[0] && conf <= confidenceRange[1];
      const keyMatch = text.includes(keyword.toLowerCase());

      return labelMatch && confMatch && keyMatch;
    });

    setFilteredData(filtered);
  }, [originalData, results, adverseChecked, nonAdverseChecked, confidenceRange, keyword]);

  return (
    <div>
      <Typography variant="h6" gutterBottom>Upload a CSV File</Typography>

      <Button variant="contained" component="label">
        Choose File
        <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
      </Button>

      {(results || originalData).length > 0 && (
        <Box mt={4}>
          <Typography variant="subtitle1">Filters</Typography>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={adverseChecked} onChange={() => setAdverseChecked(!adverseChecked)} />}
              label="Adverse"
            />
            <FormControlLabel
              control={<Checkbox checked={nonAdverseChecked} onChange={() => setNonAdverseChecked(!nonAdverseChecked)} />}
              label="Not Adverse"
            />
          </FormGroup>

          <Box mt={2} width={300}>
            <Typography gutterBottom>Confidence Range</Typography>
            <Slider
              value={confidenceRange}
              min={0} max={1} step={0.01}
              onChange={(e, v) => setConfidenceRange(v)}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box mt={2}>
            <TextField
              label="Search by Keyword"
              variant="outlined"
              size="small"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              fullWidth
            />
          </Box>
        </Box>
      )}

      {filteredData.length > 0 && (
        <Paper style={{ marginTop: 20, overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {Object.keys(filteredData[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => (
                  <TableRow key={i}>
                    {Object.values(row).map((val, j) => (
                      <TableCell key={j}>{val}</TableCell>
                    ))}
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={(e, newP) => setPage(newP)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={e => {setRowsPerPage(parseInt(e.target.value)); setPage(0);}}
            rowsPerPageOptions={[5,10,25,50]}
          />
        </Paper>
      )}
    </div>
  );
}

export default CSVUploader;
