const db = require('../db/pool');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const getReportOverview = async (req, res) => {
  try {
    const { fromDate, toDate, route, category } = req.query;

    let sql = `
      SELECT 
        'Daily Sales' AS report_type,
        o.ordered_date AS date,
        tr.end_location AS route,
        p.product_name AS product_category,
        SUM(oi.quantity * oi.unit_price) AS sales_amount,
        COUNT(DISTINCT o.order_id) AS transactions
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      JOIN truck_routes tr ON o.route_id = tr.route_id
      WHERE 1 = 1
    `;

    const params = [];

    if (fromDate) {
      sql += ' AND o.ordered_date >= ?';
      params.push(fromDate);
    }
    if (toDate) {
      sql += ' AND o.ordered_date <= ?';
      params.push(toDate);
    }
    if (route) {
      sql += ' AND tr.end_location LIKE ?';
      params.push(`%${route}%`);
    }
    if (category) {
      sql += ' AND p.product_name LIKE ?';
      params.push(`%${category}%`);
    }

    sql += `
      GROUP BY o.ordered_date, tr.end_location, p.product_name
      ORDER BY o.ordered_date DESC;
    `;

    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
};

const generatePDFReport = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        'Daily Sales' AS report_type,
        o.ordered_date AS date,
        tr.end_location AS route,
        p.product_name AS product_category,
        SUM(oi.quantity * oi.unit_price) AS sales_amount,
        COUNT(DISTINCT o.order_id) AS transactions
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      JOIN truck_routes tr ON o.route_id = tr.route_id
      GROUP BY o.ordered_date, tr.end_location, p.product_name
      ORDER BY o.ordered_date DESC;
    `);

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const fileName = `report_${Date.now()}.pdf`;
    const filePath = `tmp/${fileName}`;

    if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text('Report Overview', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(
      'Report Type | Date | Route | Product Category | Sales Amount | Transactions'
    );
    doc.moveDown(0.5);

    rows.forEach((r) => {
      doc
        .fontSize(10)
        .text(
          `${r.report_type} | ${r.date} | ${r.route} | ${r.product_category} | Rs.${r.sales_amount.toFixed(
            2
          )} | ${r.transactions}`
        );
    });

    doc.end();

    stream.on('finish', () => {
      res.download(filePath, fileName, () => {
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error('Error creating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};

module.exports = {
  getReportOverview,
  generatePDFReport
};
