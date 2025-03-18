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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Group items by semester
function groupBySemester(items, language) {
    const grouped = {};
    items.forEach((item) => {
        const semester = item.semester[language];
        if (!grouped[semester]) {
            grouped[semester] = [];
        }
        grouped[semester].push(item);
    });
    return grouped;
}

function Row({ semester, courses, headers, language }) {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            {/* Main Row: Semester */}
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
            
            {/* Expanded Row: Course & Grades Table */}
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

    if (!data || !data.locales || !data.locales[selectedLanguageId] || !data.items) {
        return <p>Loading or language data is missing...</p>;
    }

    const headers = data.locales[selectedLanguageId];
    const groupedData = groupBySemester(data.items, selectedLanguageId);

    return (
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
    );
}
