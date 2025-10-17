import { useState, useEffect } from 'react';
import ReportHeader from '../../components/reportOverview/ReportHeader/ReportHeader'
import ReportFilters from '../../components/reportOverview/ReportFilters/ReportFilters'
import ReportActions from '../../components/reportOverview/ReportActions/ReportActions'
import ReportTable from '../../components/reportOverview/ReportTable/ReportTable'
import reportService from '../../services/reportService';
import './ReportOverview.css'

const ReportOverview = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });
  const [summary, setSummary] = useState(null);

  // Fetch reports on mount and when filters change
  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await reportService.getReports(filters);
      
      if (response.success) {
        setOrders(response.data.orders || []);
        setSummary(response.data.summary);
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

  const handleExport = () => {
    if (!orders || orders.length === 0) {
      alert('No data to export');
      return;
    }

    // Prepare CSV data
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Customer Email',
      'Store',
      'Delivery Location',
      'Status',
      'Total Price',
      'Products'
    ];

    // Convert orders to CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...orders.map(order => [
        order.order_id,
        new Date(order.ordered_date).toLocaleDateString(),
        `"${order.customer_name}"`, // Wrap in quotes to handle commas
        order.customer_email,
        order.store,
        order.delivery_location,
        order.status,
        order.total_price,
        `"${order.products || 'N/A'}"` // Wrap in quotes to handle commas
      ].join(','))
    ];

    // Create CSV string
    const csvContent = csvRows.join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Generate filename with current date
    const filename = `orders-report-${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && orders.length === 0) {
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
      />
      <ReportActions onExport={handleExport} />
      <ReportTable 
        orders={orders} 
        loading={loading}
        summary={summary}
      />
    </div>
  );
};

export default ReportOverview
