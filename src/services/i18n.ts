export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Branding & Header
    farmName: 'Yamuna Farming',
    farmTagline: 'Modern Mushroom Cultivation & Sales',
    ownerTitle: 'Farm Owner & Operator',
    ownerName: 'Mohit Kumar Mahato',
    languageName: 'English',
    switchLanguage: 'हिंदी में देखें',

    // Nav
    navOverview: 'Overview',
    navDashboard: 'Dashboard',
    navOperations: 'Operations',
    navProduction: 'Production Batches',
    navHarvest: 'Harvest Records',
    navInventory: 'Stock & Inventory',
    navSalesCRM: 'Sales & Delivery',
    navOrders: 'Orders Management',
    navDeliveries: 'Delivery Logistics',
    navCustomers: 'Customer Directory',
    navSuppliers: 'Raw Material Suppliers',
    navSalesPOS: 'Sales & Invoicing',
    navFinance: 'Finance & Accounts',
    navPayments: 'Payments & Cashbook',
    navExpenses: 'Farm Expenses',
    navProfitLoss: 'Profit & Loss (P&L)',
    navAnalytics: 'Analytics & System',
    navReports: 'Reports & Export',
    navNotifications: 'Alerts & Reminders',
    navSettings: 'Farm Settings',
    navBackup: 'Backup & Cloud DB',
    logout: 'Sign Out',
    activeUser: 'Logged in as',

    // Dashboard Cards
    totalProduced: 'Total Produced',
    totalSold: 'Total Sold / Dispatched',
    availableStock: 'Available Stock',
    todayProduction: "Today's Harvest",
    todaySales: "Today's Revenue",
    totalRevenue: 'Gross Sales Revenue',
    cashCollected: 'Cash / UPI Received',
    pendingCustomerDues: 'Pending Customer Dues',
    totalExpenses: 'Total Farm Expenses',
    netProfit: 'Net Operating Profit',
    activeBatches: 'Active Growing Batches',
    harvestEfficiency: 'Avg Harvest Yield / Bag',
    lowStockNotice: 'Low stock alerts require attention',
    urgentDeliveries: 'Orders due for delivery today',

    // Statuses
    status_new: 'New Order',
    status_confirmed: 'Confirmed',
    status_processing: 'In Preparation',
    status_ready_for_dispatch: 'Ready for Dispatch',
    status_dispatched: 'Dispatched',
    status_delivered: 'Delivered',
    status_cancelled: 'Cancelled',

    // Varieties
    variety_Oyster: 'Oyster Mushroom (ढींगरी)',
    variety_Button: 'Button Mushroom (बटन)',
    variety_Milky: 'Milky Mushroom (दूधिया)',
    variety_Shiitake: 'Shiitake Mushroom',
    variety_PaddyStraw: 'Paddy Straw Mushroom (पुआल खुंभी)',

    // Actions
    addOrder: '+ New Order',
    logHarvest: '+ Record Harvest',
    newBatch: '+ New Production Batch',
    addExpense: '+ Add Expense',
    recordPayment: '+ Record Payment',
    quickSale: '⚡ Quick Farm-Gate Sale',
    exportCSV: 'Export CSV',
    printReport: 'Print Report',
    printInvoice: 'Print Invoice',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save Changes',
    confirm: 'Confirm',
    viewDetails: 'View Details',
    filterByStatus: 'Filter by Status',
    all: 'All',
    searchPlaceholder: 'Search by name, code, phone...',
    noRecordsFound: 'No records found matching criteria.',

    // Common labels
    date: 'Date',
    quantity: 'Quantity (kg)',
    ratePerKg: 'Rate (₹/kg)',
    totalAmount: 'Total Amount',
    balanceDue: 'Balance Due',
    paid: 'Paid',
    status: 'Status',
    actions: 'Actions',
    phone: 'Phone',
    address: 'Address',
    notes: 'Notes & Remarks',
  },
  hi: {
    // Branding & Header
    farmName: 'यमुना फार्मिंग',
    farmTagline: 'आधुनिक मशरूम उत्पादन एवं बिक्री प्रबंधन',
    ownerTitle: 'फार्म संचालक एवं स्वामी',
    ownerName: 'मोहित कुमार महतो',
    languageName: 'हिन्दी',
    switchLanguage: 'Switch to English',

    // Nav
    navOverview: 'अवलोकन',
    navDashboard: 'डैशबोर्ड',
    navOperations: 'फार्म संचालन',
    navProduction: 'उत्पादन बैच (Production)',
    navHarvest: 'तुड़ाई रिकॉर्ड (Harvest)',
    navInventory: 'स्टॉक एवं इन्वेंटरी (Stock)',
    navSalesCRM: 'बिक्री एवं डिलीवरी',
    navOrders: 'ऑर्डर प्रबंधन (Orders)',
    navDeliveries: 'डिलीवरी एवं परिवहन',
    navCustomers: 'ग्राहक सूची (Customers)',
    navSuppliers: 'कच्चा माल सप्लायर',
    navSalesPOS: 'बिक्री एवं बिलिंग (Invoices)',
    navFinance: 'वित्त एवं हिसाब-किताब',
    navPayments: 'भुगतान व रोकड़ बही (Cashbook)',
    navExpenses: 'फार्म खर्चे (Expenses)',
    navProfitLoss: 'लाभ-हानि खाता (Profit & Loss)',
    navAnalytics: 'रिपोर्ट व सेटिंग्स',
    navReports: 'व्यापारिक रिपोर्ट (Reports)',
    navNotifications: 'सूचनाएं व अलर्ट (Alerts)',
    navSettings: 'फार्म सेटिंग्स',
    navBackup: 'डेटा बैकअप व क्लाउड DB',
    logout: 'लॉग आउट',
    activeUser: 'सक्रिय उपयोगकर्ता',

    // Dashboard Cards
    totalProduced: 'कुल मशरूम उत्पादन',
    totalSold: 'कुल बिक्री / डिलीवरी',
    availableStock: 'उपलब्ध ताजा स्टॉक',
    todayProduction: 'आज की कुल तुड़ाई',
    todaySales: 'आज की कुल बिक्री',
    totalRevenue: 'सकल बिक्री आमदनी',
    cashCollected: 'प्राप्त रोकड़ / UPI',
    pendingCustomerDues: 'ग्राहकों पर बकाया',
    totalExpenses: 'कुल फार्म खर्च',
    netProfit: 'शुद्ध मुनाफा (Net Profit)',
    activeBatches: 'सक्रिय उत्पादन बैच',
    harvestEfficiency: 'औसत उपज प्रति बैग',
    lowStockNotice: 'स्टॉक कम होने की चेतावनी',
    urgentDeliveries: 'आज डिलीवरी हेतु निर्धारित ऑर्डर',

    // Statuses
    status_new: 'नया ऑर्डर',
    status_confirmed: 'स्वीकृत (Confirmed)',
    status_processing: 'तैयारी जारी (Processing)',
    status_ready_for_dispatch: 'डिस्पैच हेतु तैयार',
    status_dispatched: 'डिस्पैच किया गया',
    status_delivered: 'सफलतापूर्वक डिलीवर',
    status_cancelled: 'रद्द (Cancelled)',

    // Varieties
    variety_Oyster: 'ऑयस्टर / ढींगरी मशरूम',
    variety_Button: 'बटन मशरूम',
    variety_Milky: 'दूधिया (Milky) मशरूम',
    variety_Shiitake: 'शिताके मशरूम',
    variety_PaddyStraw: 'पुआल मशरूम (Paddy Straw)',

    // Actions
    addOrder: '+ नया ऑर्डर दर्ज करें',
    logHarvest: '+ तुड़ाई दर्ज करें (Harvest)',
    newBatch: '+ नया उत्पादन बैच शुरू करें',
    addExpense: '+ खर्च दर्ज करें',
    recordPayment: '+ भुगतान दर्ज करें',
    quickSale: '⚡ त्वरित बिक्री (Farm-Gate Sale)',
    exportCSV: 'CSV डाउनलोड करें',
    printReport: 'रिपोर्ट प्रिंट करें',
    printInvoice: 'बिल प्रिंट करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    cancel: 'रद्द करें',
    save: 'सुरक्षित करें',
    confirm: 'पुष्टि करें',
    viewDetails: 'विवरण देखें',
    filterByStatus: 'स्थिति अनुसार फ़िल्टर',
    all: 'सभी',
    searchPlaceholder: 'नाम, बिल नंबर, फोन द्वारा खोजें...',
    noRecordsFound: 'कोई रिकॉर्ड नहीं मिला।',

    // Common labels
    date: 'दिनांक',
    quantity: 'मात्रा (किलोग्राम)',
    ratePerKg: 'दर (₹/किग्रा)',
    totalAmount: 'कुल राशि',
    balanceDue: 'बकाया राशि',
    paid: 'जमा राशि',
    status: 'स्थिति',
    actions: 'कार्रवाई',
    phone: 'फ़ोन नंबर',
    address: 'पता',
    notes: 'विशेष विवरण / टिप्पणी',
  },
};

export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatKg = (qty: number): string => {
  if (qty >= 1) {
    return `${Number(qty.toFixed(2))} kg`;
  }
  return `${Math.round(qty * 1000)} g`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};
