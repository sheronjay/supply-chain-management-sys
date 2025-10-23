import { useState, useEffect } from 'react';
import ReportHeader from '../../components/reportOverview/ReportHeader/ReportHeader'
import ReportFilters from '../../components/reportOverview/ReportFilters/ReportFilters'
import ReportActions from '../../components/reportOverview/ReportActions/ReportActions'
import ReportTable from '../../components/reportOverview/ReportTable/ReportTable'
import reportService from '../../services/reportService';
import './ReportOverview.css'

const ReportOverview = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('orders');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    year: new Date().getFullYear(),
    quarter: Math.ceil((new Date().getMonth() + 1) / 3),
    month: '',
    customerId: ''
  });
  const [summary, setSummary] = useState(null);

  // Fetch reports when report type or filters change
  useEffect(() => {
    fetchReports();
  }, [reportType, filters.startDate, filters.endDate, filters.year, filters.quarter, filters.month, filters.customerId]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      switch (reportType) {
        case 'orders':
          response = await reportService.getReports({
            startDate: filters.startDate,
            endDate: filters.endDate
          });
          if (response.success) {
            setReportData(response.data.orders || []);
            setSummary(response.data.summary);
          }
          break;
          
        case 'quarterly-sales-value':
          response = await reportService.getQuarterlySalesValue(filters.year);
          if (response.success) {
            setReportData(response.data || []);
            setSummary(null);
          }
          break;
          
        case 'quarterly-sales-volume':
          response = await reportService.getQuarterlySalesVolume(filters.year);
          if (response.success) {
            setReportData(response.data || []);
            setSummary(null);
          }
          break;
          
        case 'most-ordered-items':
          response = await reportService.getMostOrderedItems(filters.year, filters.quarter);
          if (response.success) {
            setReportData(response.data || []);
            setSummary(null);
          }
          break;
          
        case 'working-hours':
          response = await reportService.getWorkingHoursReport(filters.startDate, filters.endDate);
          if (response.success) {
            setReportData(response.data || []);
            setSummary(null);
          }
          break;
          
        case 'truck-usage':
          response = await reportService.getTruckUsageReport(filters.year, filters.month);
          if (response.success) {
            setReportData(response.data || []);
            setSummary(null);
          }
          break;
          
        case 'customer-order-history':
          response = await reportService.getCustomerOrderHistory(
            filters.customerId,
            filters.startDate,
            filters.endDate
          );
          if (response.success) {
            setReportData(response.data || []);
            setSummary(null);
          }
          break;
          
        default:
          setError('Unknown report type');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleReportTypeChange = (newReportType) => {
    setReportType(newReportType);
    setReportData([]);
    setSummary(null);
  };

  const handleExport = () => {
    if (!reportData || reportData.length === 0) {
      alert('No data to export');
      return;
    }

    let headers = [];
    let csvRows = [];

    // Create CSV based on report type
    switch (reportType) {
      case 'orders':
        headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Store', 'Delivery Location', 'Status', 'Total Price', 'Products'];
        csvRows = reportData.map(order => [
          order.order_id,
          new Date(order.ordered_date).toLocaleDateString(),
          `"${order.customer_name}"`,
          order.customer_email,
          order.store,
          order.delivery_location,
          order.status,
          order.total_price,
          `"${order.products || 'N/A'}"`
        ].join(','));
        break;
        
      case 'quarterly-sales-value':
        headers = ['Quarter', 'Year', 'Total Revenue', 'Order Count'];
        csvRows = reportData.map(row => [
          `Q${row.quarter}`,
          row.year,
          row.total_revenue,
          row.order_count
        ].join(','));
        break;
        
      case 'quarterly-sales-volume':
        headers = ['Quarter', 'Year', 'Total Quantity', 'Order Count'];
        csvRows = reportData.map(row => [
          `Q${row.quarter}`,
          row.year,
          row.total_quantity,
          row.order_count
        ].join(','));
        break;
        
      case 'most-ordered-items':
        headers = ['Product ID', 'Product Name', 'Total Quantity', 'Order Count', 'Total Revenue'];
        csvRows = reportData.map(item => [
          item.product_id,
          `"${item.product_name}"`,
          item.total_quantity,
          item.order_count,
          item.total_revenue
        ].join(','));
        break;
        
      case 'working-hours':
        headers = ['User ID', 'Name', 'Designation', 'Store', 'Total Hours Worked'];
        csvRows = reportData.map(emp => [
          emp.user_id,
          `"${emp.name}"`,
          emp.designation,
          emp.store_city,
          emp.total_hours_worked
        ].join(','));
        break;
        
      case 'truck-usage':
        headers = ['Truck ID', 'Registration', 'Store', 'Capacity', 'Used Hours', 'Total Deliveries'];
        csvRows = reportData.map(truck => [
          truck.truck_id,
          truck.reg_number,
          truck.store_city,
          truck.capacity,
          truck.used_hours,
          truck.total_deliveries
        ].join(','));
        break;
        
      case 'customer-order-history':
        headers = ['Customer ID', 'Customer Name', 'Email', 'Phone', 'Order ID', 'Order Date', 'Status', 'Total Price', 'Products'];
        csvRows = reportData.map(row => [
          row.customer_id,
          `"${row.customer_name}"`,
          row.email,
          row.phone_number,
          row.order_id,
          row.ordered_date ? new Date(row.ordered_date).toLocaleDateString() : 'N/A',
          row.status || 'N/A',
          row.total_price || 0,
          `"${row.products || 'N/A'}"`
        ].join(','));
        break;
        
      default:
        alert('Unknown report type');
        return;
    }

    // Create CSV string
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Generate filename with current date and report type
    const filename = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && reportData.length === 0) {
    return (
      <div className="report-overview">
        <ReportHeader />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-overview">
        <ReportHeader />
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
          <p>{error}</p>
          <button onClick={fetchReports}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-overview">
      <ReportHeader />
      <ReportFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        reportType={reportType}
      />
      <ReportActions 
        onExport={handleExport}
        onReportTypeChange={handleReportTypeChange}
        currentReportType={reportType}
      />
      <ReportTable 
        data={reportData} 
        loading={loading}
        summary={summary}
        reportType={reportType}
      />
    </div>
  );
};

export default ReportOverview
