import React from 'react';
import { useLanguage } from '/src/providers/LanguageProvider.jsx';

function GradeTable({ data }) {
    const { selectedLanguageId } = useLanguage(); // Using selectedLanguageId as in the working component

    // Safety check to ensure that locales and items data are properly loaded and accessible
    if (!data || !data.locales || !data.locales[selectedLanguageId] || !data.items) {
        return <p>Loading or language data is missing...</p>; // Or any other fallback UI
    }

    // Ensure that all data necessary for rendering is available
    const headers = data.locales[selectedLanguageId];
    if (!headers || !headers.course || !headers.grade || !headers.semester) {
        return <p>Header information is incomplete or missing for the current language.</p>;
    }

    return (
        <div className="grade-table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>{headers.course}</th>
                        <th>{headers.grade}</th>
                        <th>{headers.semester}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, index) => {
                        const course = item.course[selectedLanguageId];
                        const grade = item.grade[selectedLanguageId];
                        const semester = item.semester[selectedLanguageId];
                        // Additional safety check for each item
                        if (!course || !grade || !semester) {
                            return <tr key={index}><td colSpan="3">Incomplete data for some entries.</td></tr>;
                        }
                        return (
                            <tr key={index}>
                                <td>{course}</td>
                                <td>{grade}</td>
                                <td>{semester}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default GradeTable;
