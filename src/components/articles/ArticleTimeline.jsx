import React, { useState } from 'react';
import { useLanguage } from '/src/providers/LanguageProvider.jsx';
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

// ✅ Function to group courses by semester
function groupBySemester(semesters, language) {
    const grouped = {};
    semesters.forEach((semester) => {
        const semesterName = semester.semester[language];
        if (!grouped[semesterName]) {
            grouped[semesterName] = [];
        }
        grouped[semesterName].push(...semester.courses);
    });
    return grouped;
}

// ✅ CSV Download Function
function downloadCSV(data, headers) {
    let csvContent = `${headers.semester},${headers.course},${headers.term},${headers.credits},${headers.category},${headers.grade}\n`;
    Object.entries(data).forEach(([semester, courses]) => {
        courses.forEach(course => {
            csvContent += `${semester},${course.course.en},${course.term.en},${course.credits},${course.category.en},${course.grade.en}\n`;
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

// ✅ PDF Download Function (Update file URL)
function downloadPDF() {
    const pdfUrl = '410402446.pdf'; // Update this to your correct PDF path
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'official_grades.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ✅ Collapsible Row Component with Additional Columns
function Row({ semester, courses, headers, language }) {
    const [open, setOpen] = useState(false);

    return (
        <>
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
                <TableCell component="th" scope="row" colSpan={5}>
                    <Typography variant="h6">{semester}</Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                {headers.course} & {headers.grade}
                            </Typography>
                            <Table size="small" aria-label="grades">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{headers.course}</TableCell>
                                        <TableCell>{headers.term}</TableCell>
                                        <TableCell align="center">{headers.credits}</TableCell>
                                        <TableCell align="center">{headers.category}</TableCell>
                                        <TableCell align="center">{headers.grade}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {courses.map((course, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{course.course[language]}</TableCell>
                                            <TableCell>{course.term[language]}</TableCell>
                                            <TableCell align="center">{course.credits}</TableCell>
                                            <TableCell align="center">{course.category[language]}</TableCell>
                                            <TableCell align="center">{course.grade[language]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

// ✅ Main Component (Keeps Timeline & Grade Table)
function ArticleTimeline({ data }) {
    const { selectedLanguageId } = useLanguage();
    const parser = useParser();

    // ✅ Extract items for Timeline
    const parsedData = parser.parseArticleData(data);
    const items = parsedData.items;
    parser.sortArticleItemsByDateDesc(items);
    const parsedItems = parser.formatForTimeline(items);

    // ✅ Extract semesters from `items[0].semesters`
    const semesters = data.items?.[0]?.semesters || [];

    if (semesters.length === 0) {
        return <Typography variant="h6">No data available</Typography>;
    }
    
    const groupedData = groupBySemester(semesters, selectedLanguageId);
    const headers = data.locales[selectedLanguageId];

    return (
        <Article className={`article-timeline`} title={parsedData.title}>
            {/* ✅ Timeline Data Display */}
            <Timeline items={parsedItems} />

            {/* ✅ Grade Table with Collapsible Rows */}
            <Box>
                
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={5} style={{  fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}>
                                {headers.transcript || "Transcript"}
                            </TableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(groupedData).map(([semester, courses], index) => (
                            <Row key={index} semester={semester} courses={courses} headers={headers} language={selectedLanguageId} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => downloadCSV(groupedData, headers)} sx={{ mr: 1 }}>
                        Download CSV
                    </Button>
                    <Button variant="contained" color="secondary" onClick={downloadPDF}>
                        Download PDF
                    </Button>
                </Box>
            </Box>
        </Article>
    );
}

export default ArticleTimeline;
