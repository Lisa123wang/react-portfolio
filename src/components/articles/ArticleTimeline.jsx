import React from 'react';
import Article from "/src/components/wrappers/Article.jsx";
import Timeline from "/src/components/generic/Timeline.jsx";
import { useParser } from "/src/helpers/parser.js";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Helper function to generate table data (you can adjust this logic based on your actual data structure)
function generateTableData(parsedData) {
    return parsedData.items.map(item => ({
        date: item.date,
        title: item.title,
        description: item.description,
        grade: item.grade, // Add grade or any other specific fields you need
    }));
}

// Function to handle CSV download
function downloadCSV(data, headers) {
    let csvContent = `${headers.date},${headers.title},${headers.description},${headers.grade}\n`;
    data.forEach(row => {
        csvContent += `${row.date},${row.title},${row.description},${row.grade}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'timeline_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Function to handle PDF download
function downloadPDF() {
    const pdfUrl = 'sample.pdf'; // Update this URL with your PDF
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'timeline_data.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Row component for collapsible rows
function Row({ item, headers }) {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" colSpan={3}>
                    <Typography variant="h6">{item.title}</Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                {headers.date} & {headers.description} & {headers.grade}
                            </Typography>
                            <Table size="small" aria-label="item details">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{headers.date}</TableCell>
                                        <TableCell align="center">{headers.description}</TableCell>
                                        <TableCell align="center">{headers.grade}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell align="center">{item.description}</TableCell>
                                        <TableCell align="center">{item.grade}</TableCell> {/* Assuming grade is available */}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function ArticleTimeline({ data }) {
    const parser = useParser();

    const parsedData = parser.parseArticleData(data);
    const items = parsedData.items;
    parser.sortArticleItemsByDateDesc(items);

    const parsedItems = parser.formatForTimeline(items);
    const tableData = generateTableData(parsedData);

    const headers = {
        date: "Date",
        title: "Title",
        description: "Description",
        grade: "Grade", // New column for grade (or any other category)
    };

    return (
        <Article className={`article-timeline`} title={parsedData.title}>
            <Timeline items={parsedItems} />

            {/* Table Section */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Timeline Data Table
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => downloadCSV(tableData, headers)} sx={{ mr: 1 }}>
                        Download CSV
                    </Button>
                    <Button variant="contained" color="secondary" onClick={downloadPDF}>
                        Download PDF
                    </Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>{headers.title}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((item, index) => (
                                <Row key={index} item={item} headers={headers} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Article>
    );
}

export default ArticleTimeline;
