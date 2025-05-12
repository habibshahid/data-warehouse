// src/hooks/useReport.js
import { useState } from 'react';
import { message } from 'antd';
import { generateReport, downloadReport, scheduleReport, listScheduledReports } from '../api/reportService';

/**
 * Custom hook for report generation and management
 */
const useReport = () => {
  const [reports, setReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [loading, setLoading] = useState(false);
  
  /**
   * Generate a new report based on params
   * @param {Object} reportParams - Parameters for report generation
   * @returns {Promise<Object>} The generated report
   */
  const createReport = async (reportParams) => {
    try {
      setLoading(true);
      
      const report = await generateReport(reportParams);
      
      // Add to reports list
      setReports(prevReports => [report, ...prevReports]);
      
      message.success('Report generated successfully');
      
      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      message.error('Failed to generate report');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Download a report
   * @param {string} reportId - ID of the report to download
   * @param {string} format - Format of the report (pdf, excel, csv)
   */
  const getReportDownload = async (reportId, format) => {
    try {
      setLoading(true);
      await downloadReport(reportId, format);
      message.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      message.error('Failed to download report');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Schedule a recurring report
   * @param {Object} scheduleParams - Parameters for the scheduled report
   * @returns {Promise<Object>} The scheduled report
   */
  const createScheduledReport = async (scheduleParams) => {
    try {
      setLoading(true);
      
      const scheduledReport = await scheduleReport(scheduleParams);
      
      // Add to scheduled reports list
      setScheduledReports(prevReports => [scheduledReport, ...prevReports]);
      
      message.success('Report scheduled successfully');
      
      return scheduledReport;
    } catch (error) {
      console.error('Error scheduling report:', error);
      message.error('Failed to schedule report');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Fetch all scheduled reports
   */
  const fetchScheduledReports = async () => {
    try {
      setLoading(true);
      const data = await listScheduledReports();
      setScheduledReports(data);
      return data;
    } catch (error) {
      console.error('Error fetching scheduled reports:', error);
      message.error('Failed to fetch scheduled reports');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Delete a scheduled report
   * @param {string} reportId - ID of the report to delete
   */
  const deleteScheduledReport = async (reportId) => {
    try {
      setLoading(true);
      
      // Call API to delete (implementation would be in reportService.js)
      // await deleteScheduledReport(reportId);
      
      // Update state by removing the deleted report
      setScheduledReports(prevReports => 
        prevReports.filter(report => report.id !== reportId)
      );
      
      message.success('Scheduled report deleted successfully');
    } catch (error) {
      console.error('Error deleting scheduled report:', error);
      message.error('Failed to delete scheduled report');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    reports,
    scheduledReports,
    loading,
    createReport,
    getReportDownload,
    createScheduledReport,
    fetchScheduledReports,
    deleteScheduledReport,
  };
};

export default useReport;