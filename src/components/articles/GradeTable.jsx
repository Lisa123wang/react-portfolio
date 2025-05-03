import * as React from 'react';
import { useLanguage } from '/src/providers/LanguageProvider.jsx';
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

// Updated to handle semesters containing multiple courses
function groupBySemester(semesters, language) {
    const grouped = {};
    semesters.forEach((semester) => {
        const semesterName = semester.semester[language];
        if (!grouped[semesterName]) {
            grouped[semesterName] = semester.courses;
        }
    });
    return grouped;
}

// Download table as CSV
function downloadCSV(data, headers) {
    let csvContent = `${headers.semester},${headers.course},${headers.grade}\n`;

    Object.entries(data).forEach(([semester, courses]) => {
        courses.forEach(course => {
            csvContent += `${semester},${course.course.en},${course.grade.en}\n`;
        });
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'grades.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Download official grade PDF (replace with actual file URL)
function downloadPDF() {
    const pdfUrl = '410402446.pdf'; // Update this URL
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'official_transcript.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function Row({ semester, courses, headers, language }) {
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
                <TableCell component="th" scope="row" colSpan={2}>
                    <Typography variant="h6">{semester}</Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                {headers.course} & {headers.grade}
                            </Typography>
                            <Table size="small" aria-label="grades">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{headers.course}</TableCell>
                                        <TableCell align="center">{headers.grade}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {courses.map((course, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{course.course[language]}</TableCell>
                                            <TableCell align="center">{course.grade[language]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function GradeTable({ data }) {
    const { selectedLanguageId } = useLanguage();

    if (!data || !data.locales || !data.locales[selectedLanguageId] || !data.semesters) {
        return <p>Loading or language data is missing...</p>;
    }

    const headers = data.locales[selectedLanguageId];
    const groupedData = groupBySemester(data.semesters, selectedLanguageId);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" color="primary" onClick={() => downloadCSV(groupedData, headers)} sx={{ mr: 1 }}>
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
                            <TableCell>{headers.semester}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(groupedData).map(([semester, courses], index) => (
                            <Row key={index} semester={semester} courses={courses} headers={headers} language={selectedLanguageId} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
