// src/utils/pdfGenerator.js

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Why this is better ---
// 1. Centralized Theme: Colors and fonts are defined once, making style updates easy.
// 2. Robust Data Handling: Correctly handles booleans (true/false) from our form and optional fields.
// 3. Bug-Free Styling: Properly maps risk levels to correct hex color codes instead of breaking on Tailwind classes.
// 4. Cleaner Code: Uses helper functions to build HTML, making the main function much easier to read and maintain.

const theme = {
    colors: {
        primary: '#3b82f6',
        heading: '#1f2937',
        text: '#374151',
        muted: '#6b7280',
        border: '#e5e7eb',
        background: '#f8fafc',
        white: '#ffffff',
    },
    font: 'Inter, sans-serif',
};

const riskColorMap = {
    'Low': '#10b981',      // Green
    'Moderate': '#f59e0b', // Amber
    'High': '#ef4444',      // Red
};

// Helper function to generate a table row
const createTableRow = (label, value) => {
    if (!value && value !== 0 && value !== false) return ''; // Don't render row if value is null/undefined/empty string

    let displayValue = value;
    if (typeof value === 'boolean') {
        displayValue = value ? 'Yes' : 'No';
    }

    return `
    <tr>
    <td style="padding: 10px 14px; border: 1px solid ${theme.colors.border}; font-weight: 600;">${label}</td>
    <td style="padding: 10px 14px; border: 1px solid ${theme.colors.border};">${displayValue}</td>
    </tr>
    `;
}

export const generatePdfReport = async (results) => {
    const { finalInterval, riskLevel, nextPumpDate, baseInterval, factors, inputs } = results;
    const pdfContainer = document.createElement('div');
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.width = '800px';
    pdfContainer.style.padding = '40px';
    pdfContainer.style.backgroundColor = theme.colors.white;
    pdfContainer.style.color = theme.colors.text;
    pdfContainer.style.fontFamily = theme.font;

    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    pdfContainer.innerHTML = `
    <div style="font-size: 14px; line-height: 1.6;">
    <!-- Header -->
    <header style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid ${theme.colors.primary};">
    <div>
    <h1 style="font-size: 28px; font-weight: 800; color: ${theme.colors.heading}; margin: 0;">Septic System Report</h1>
    <p style="font-size: 15px; color: ${theme.colors.muted}; margin: 4px 0 0;">Pumping Frequency Analysis</p>
    </div>
    <div style="text-align: right; font-size: 13px; color: ${theme.colors.muted};">
    <strong>Generated:</strong> ${currentDate}
    </div>
    </header>

    <!-- Summary -->
    <section style="margin-top: 30px; background: ${theme.colors.background}; padding: 20px; border-radius: 8px;">
    <h2 style="font-size: 18px; font-weight: 700; color: ${theme.colors.heading}; margin: 0 0 16px;">Executive Summary</h2>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
    <div style="text-align: center; background: ${theme.colors.white}; padding: 16px; border-radius: 6px; border: 1px solid ${theme.colors.border};">
    <p style="font-size: 13px; color: ${theme.colors.muted}; margin: 0 0 8px;">Recommended Interval</p>
    <p style="font-size: 32px; font-weight: 800; color: ${theme.colors.primary}; margin: 0;">${finalInterval.toFixed(1)} <span style="font-size: 20px; font-weight: 600;">yrs</span></p>
    </div>
    <div style="text-align: center; background: ${theme.colors.white}; padding: 16px; border-radius: 6px; border: 1px solid ${theme.colors.border};">
    <p style="font-size: 13px; color: ${theme.colors.muted}; margin: 0 0 8px;">System Risk Level</p>
    <p style="font-size: 24px; font-weight: 700; color: ${riskColorMap[riskLevel.level] || theme.colors.text}; margin: 0;">${riskLevel.level}</p>
    </div>
    <div style="text-align: center; background: ${theme.colors.white}; padding: 16px; border-radius: 6px; border: 1px solid ${theme.colors.border};">
    <p style="font-size: 13px; color: ${theme.colors.muted}; margin: 0 0 8px;">Next Estimated Due Date</p>
    <p style="font-size: 20px; font-weight: 700; color: ${theme.colors.heading}; margin: 0;">${nextPumpDate ? new Date(nextPumpDate).toLocaleDateString() : 'N/A'}</p>
    </div>
    </div>
    </section>

    <!-- Input Parameters -->
    <section style="margin-top: 30px;">
    <h2 style="font-size: 18px; font-weight: 700; color: ${theme.colors.heading}; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 1px solid ${theme.colors.border};">Input Parameters</h2>
    <table style="width: 100%; border-collapse: collapse;">
    ${createTableRow('Tank Size', `${inputs.tankSize} gallons`)}
    ${createTableRow('Household Size', `${inputs.householdSize} people`)}
    ${createTableRow('Water Usage', inputs.waterUsage)}
    ${createTableRow('Garbage Disposal', inputs.garbageDisposal)}
    ${createTableRow('Laundry Frequency', inputs.laundryFrequency)}
    ${createTableRow('Laundry Habits', inputs.laundryHabits)}
    ${createTableRow('Water Softener', inputs.waterSoftener)}
    ${createTableRow('System Type', inputs.systemType)}
    ${createTableRow('Soil Type', inputs.soilType)}
    ${createTableRow('System Age', `${inputs.systemAge} years`)}
    ${createTableRow('Last Pumped Date', inputs.lastPumped ? new Date(inputs.lastPumped).toLocaleDateString() : null)}
    </table>
    </section>

    <!-- Footer -->
    <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid ${theme.colors.border};">
    <p style="font-size: 12px; color: ${theme.colors.muted}; text-align: center; margin: 0;">
    <strong>Disclaimer:</strong> This is an estimation tool. Always consult a licensed professional and adhere to local regulations.
    </p>
    </footer>
    </div>
    `;
    document.body.appendChild(pdfContainer);

    try {
        const canvas = await html2canvas(pdfContainer, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Septic-Report-${Date.now()}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    } finally {
        document.body.removeChild(pdfContainer);
    }
};
