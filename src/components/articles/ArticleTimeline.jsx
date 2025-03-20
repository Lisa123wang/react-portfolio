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
    let csvContent = `${headers.semester},${headers.course},${headers.term},${headers.credits},${headers.category},${headers.grade},GPA\n`;
    Object.entries(data).forEach(([semester, courses]) => {
        courses.forEach(course => {
            csvContent += `${semester},${course.course.en},${course.term.en},${course.credits},${course.category.en},${course.grade.en},${course.gpa !== undefined ? course.gpa : 4}\n`;
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

// ✅ PDF Download Function
function downloadPDF() {
    const pdfUrl = '410402446.pdf'; // Update this to your correct PDF path
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'official_grades.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ✅ Collapsible Row Component (Includes Summary & Conduct Rows)
function Row({ 
    semester, 
    courses, 
    headers, 
    language, 
    totalCredits, 
    averageGPA, 
    classRank, 
    classSize, 
    averageGrade, 
    conduct 
}) {
    const [open, setOpen] = useState(false);

    // ✅ Conduct Data with Defaults
    const conductAverageGrade = conduct?.averageGrade !== undefined ? conduct.averageGrade : "A";
    const conductGPA = conduct?.gpa !== undefined ? conduct.gpa : "4.0";
    const conductGrade = conduct?.grade !== undefined ? conduct.grade : "86.00";

    return (
        <>
            {/* Semester Title Row */}
            <TableRow>
                <TableCell>
                    <IconButton onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell colSpan={7}>
                    <Typography variant="h6">{semester}</Typography>
                </TableCell>
            </TableRow>

            {/* Expandable Course Details */}
            <TableRow>
                <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={2}>{headers.course}</TableCell>
                                        <TableCell align="center">{headers.term}</TableCell>
                                        <TableCell align="center">{headers.credits}</TableCell>
                                        <TableCell align="center">{headers.category}</TableCell>
                                        <TableCell align="center">{headers.grade}</TableCell>
                                        <TableCell align="center">GPA</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {courses.map((course, index) => (
                                        <TableRow key={index}>
                                            <TableCell colSpan={2}>{course.course[language]}</TableCell>
                                            <TableCell align="center">{course.term[language]}</TableCell>
                                            <TableCell align="center">{course.credits}</TableCell>
                                            <TableCell align="center">{course.category[language]}</TableCell>
                                            <TableCell align="center">{course.grade[language]}</TableCell>
                                            <TableCell align="center">{course.gpa !== undefined ? course.gpa : 4}</TableCell>
                                        </TableRow>
                                    ))}

                                    {/* ✅ Semester Summary Row */}
                                    <TableRow>
                                        <TableCell colSpan={3} align="right" sx={{ fontWeight: "bold" }}>
                                            Total Credits: {totalCredits || "N/A"}
                                        </TableCell>
                                        <TableCell colSpan={2} align="right" sx={{ fontWeight: "bold" }}>
                                            Avg Grade: {averageGrade || "N/A"}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                            Avg GPA: {averageGPA || "N/A"}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                            Class Rank/Size: {classRank && classSize ? `${classRank}/${classSize}` : "N/A"}
                                        </TableCell>
                                    </TableRow>

                                    {/* ✅ Conduct Row */}
                                    <TableRow>
                                        <TableCell colSpan={5} align="right" sx={{ fontWeight: "bold" }}>
                                            Conduct Avg Grade: {conductAverageGrade}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                            Conduct GPA: {conductGPA}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                            Conduct Grade: {conductGrade}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

// ✅ Main Component
function ArticleTimeline({ data }) {
    const { selectedLanguageId } = useLanguage();
    const parser = useParser();

    const parsedData = parser.parseArticleData(data);
    const items = parsedData.items;
    parser.sortArticleItemsByDateDesc(items);
    const parsedItems = parser.formatForTimeline(items);

    const semesters = data.items?.[0]?.semesters || [];

    if (semesters.length === 0) {
        return <Typography variant="h6">No data available</Typography>;
    }
    
    const groupedData = groupBySemester(semesters, selectedLanguageId);
    const headers = data.locales[selectedLanguageId];

    return (
        <Article className="article-timeline" title={parsedData.title}>
            <Timeline items={parsedItems} />

            <Box>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableBody>
                            {Object.entries(groupedData).map(([semester, courses], index) => {
                                const semesterDetails = semesters.find((s) => s.semester[selectedLanguageId] === semester);

                                return (
                                    <Row 
                                        key={index} 
                                        semester={semester} 
                                        courses={courses} 
                                        headers={headers} 
                                        language={selectedLanguageId} 
                                        totalCredits={semesterDetails?.totalCredits}
                                        averageGPA={semesterDetails?.averageGPA}
                                        classRank={semesterDetails?.classRankSize?.split('/')[0]}
                                        classSize={semesterDetails?.classRankSize?.split('/')[1]}
                                        averageGrade={semesterDetails?.averageGrade}
                                        conduct={semesterDetails?.conduct} 
                                    />
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Article>
    );
}

export default ArticleTimeline;
