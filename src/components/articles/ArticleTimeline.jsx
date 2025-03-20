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
    const conductAverageGrade = conduct?.averageGrade ?? "A";
    const conductGrade = conduct?.grade ?? "86.00";

    return (
        <>
            {/* Semester Title Row */}
            <TableRow sx={{ backgroundColor: "var(--theme-soft-2)", color: "var(--theme-secondary)" }}>
                <TableCell sx={{ color: "var(--theme-secondary)" }}>
                    <IconButton 
                        onClick={() => setOpen(!open)} 
                        sx={{ color: "var(--theme-secondary)" }}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell colSpan={7} sx={{ color: "var(--theme-secondary)", fontWeight: "bold" }}>
                    <Typography sx={{ color: "var(--theme-secondary)" }} variant="h6">
                        {semester}
                    </Typography>
                </TableCell>
            </TableRow>

            {/* Expandable Course Details */}
            <TableRow>
                <TableCell colSpan={8} sx={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "var(--theme-soft)" }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, backgroundColor: "var(--theme-soft)", color: "var(--theme-secondary)" }}>
                            <Table size="small">
                                <TableHead sx={{ backgroundColor: "var(--theme-soft)", color: "var(--theme-secondary)" }}>
                                    <TableRow>
                                        <TableCell colSpan={2} sx={{ color: "var(--theme-secondary)", fontWeight: "bold" }}>
                                            {headers.course}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "var(--theme-secondary)", fontWeight: "bold" }}>
                                            {headers.term}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "var(--theme-secondary)", fontWeight: "bold" }}>
                                            {headers.credits}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "var(--theme-secondary)", fontWeight: "bold" }}>
                                            {headers.category}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "var(--theme-secondary)", fontWeight: "bold" }}>
                                            {headers.grade}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "var(--theme-secondary)", fontWeight: "bold" }}>
                                            GPA
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {courses.map((course, index) => (
                                        <TableRow 
                                            key={index} 
                                            sx={{ backgroundColor: "var(--theme-soft)", color: "var(--theme-secondary)" }}
                                        >
                                            <TableCell colSpan={2} sx={{ color: "var(--theme-secondary)" }}>
                                                {course.course[language]}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: "var(--theme-secondary)" }}>
                                                {course.term[language]}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: "var(--theme-secondary)" }}>
                                                {course.credits}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: "var(--theme-secondary)" }}>
                                                {course.category[language]}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: "var(--theme-secondary)" }}>
                                                {course.grade[language]}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: "var(--theme-secondary)" }}>
                                                {course.gpa !== undefined ? course.gpa : 4}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {/* ✅ Semester Summary Row */}
                                    <TableRow sx={{ backgroundColor: "var(--theme-soft)", color: "var(--theme-secondary)", fontWeight: "bold" }}>
                                        <TableCell colSpan={3} align="right" sx={{ color: "var(--theme-secondary)" }}>
                                            Total Credits: {totalCredits ?? "N/A"}
                                        </TableCell>
                                        <TableCell colSpan={2} align="right" sx={{ color: "var(--theme-secondary)" }}>
                                            Avg Grade: {averageGrade ?? "N/A"}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: "var(--theme-secondary)" }}>
                                            Avg GPA: {averageGPA ?? "N/A"}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: "var(--theme-secondary)" }}>
                                            Class Rank/Size: {classRank && classSize ? `${classRank}/${classSize}` : "N/A"}
                                        </TableCell>
                                    </TableRow>

                                    {/* ✅ Conduct Row */}
                                    <TableRow sx={{ backgroundColor: "var(--theme-soft)", color: "var(--theme-secondary)" }}>
                                        <TableCell colSpan={7} align="right" sx={{ color: "var(--theme-secondary)" }}>
                                            Conduct Grade: {conductAverageGrade} ({conductGrade})
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
                {/* ✅ Download Buttons */}
               <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  
                  <Button variant="contained" color="primary" onClick={downloadPDF}>
                      Download Official Transcript
                  </Button>
              </Box>
            </Box>
        </Article>
    );
}

export default ArticleTimeline;
