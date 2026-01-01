// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import {Table, Row, Rows} from 'react-native-table-component';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// // TypeScript interfaces
// interface InvoiceRow {
//   srNo: string;
//   billNo: string;
//   invoiceDate: string;
//   totalInvoiceItemAmount: string;
//   totalTaxAmount: string;
//   totalInvoiceAmount: string;
//   totalRoundoffAmount: string;
// }

// interface SummaryData {
//   totalInvoiceItemAmount: number;
//   totalTaxAmount: number;
//   totalInvoiceAmount: number;
//   totalRoundoffAmount: number;
// }

// interface SearchFilters {
//   customerName?: string;
//   billNo?: string;
//   unit?: string;
//   fromDate?: string;
//   toDate?: string;
// }

// interface ReportData {
//   reportData: string[][];
//   headers: string[];
//   summary: SummaryData;
// }

// interface RouteParams {
//   reportData?: ReportData;
//   searchFilters?: SearchFilters;
// }

// interface InvoiceReportScreenProps {
//   route: {
//     params?: RouteParams;
//   };
//   navigation: any;
// }

// const InvoiceReportScreen: React.FC<InvoiceReportScreenProps> = ({
//   route,
//   navigation,
// }) => {
//   // Get data passed from previous screen
//   const {reportData, searchFilters} = route.params || {};

//   // State for table functionality
//   const [filteredData, setFilteredData] = useState<InvoiceRow[]>([]);
//   const [searchText, setSearchText] = useState<string>('');
//   const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     if (reportData && reportData.reportData) {
//       // Map reportData (array of arrays) to array of objects
//       const formattedData: InvoiceRow[] = reportData.reportData.map(row => ({
//         srNo: row[0] || '',
//         billNo: row[1] || '',
//         invoiceDate: row[2] || '',
//         totalInvoiceItemAmount: row[3] || '0',
//         totalTaxAmount: row[4] || '0',
//         totalInvoiceAmount: row[5] || '0',
//         totalRoundoffAmount: row[6] || '0',
//       }));
//       setFilteredData(formattedData);
//     }
//   }, [reportData]);

//   // Handle search functionality
//   const handleSearch = (text: string) => {
//     setSearchText(text);
//     setCurrentPage(1); // Reset to first page when searching

//     if (!text.trim() || !reportData || !reportData.reportData) {
//       // Reset to full data if no search text
//       const formattedData: InvoiceRow[] =
//         reportData?.reportData?.map(row => ({
//           srNo: row[0] || '',
//           billNo: row[1] || '',
//           invoiceDate: row[2] || '',
//           totalInvoiceItemAmount: row[3] || '0',
//           totalTaxAmount: row[4] || '0',
//           totalInvoiceAmount: row[5] || '0',
//           totalRoundoffAmount: row[6] || '0',
//         })) || [];
//       setFilteredData(formattedData);
//       return;
//     }

//     const filtered: InvoiceRow[] = reportData.reportData
//       .map(row => ({
//         srNo: row[0] || '',
//         billNo: row[1] || '',
//         invoiceDate: row[2] || '',
//         totalInvoiceItemAmount: row[3] || '0',
//         totalTaxAmount: row[4] || '0',
//         totalInvoiceAmount: row[5] || '0',
//         totalRoundoffAmount: row[6] || '0',
//       }))
//       .filter(row =>
//         Object.values(row).some(
//           value =>
//             value &&
//             value.toString().toLowerCase().includes(text.toLowerCase()),
//         ),
//       );

//     setFilteredData(filtered);
//   };

//   // Format currency for display
//   const formatCurrency = (amount: string | number): string => {
//     const numAmount = parseFloat(amount?.toString() || '0');
//     if (isNaN(numAmount)) return '0.00';
//     return numAmount.toLocaleString('en-IN', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });
//   };

//   // Calculate summary from filtered data
//   const calculateSummary = (): SummaryData | null => {
//     if (!reportData?.summary) return null;

//     // If filtered data exists and differs from original data, calculate new summary
//     if (searchText && filteredData.length !== reportData.reportData.length) {
//       return filteredData.reduce(
//         (acc: SummaryData, row: InvoiceRow) => {
//           acc.totalInvoiceItemAmount += parseFloat(
//             row.totalInvoiceItemAmount || '0',
//           );
//           acc.totalTaxAmount += parseFloat(row.totalTaxAmount || '0');
//           acc.totalInvoiceAmount += parseFloat(row.totalInvoiceAmount || '0');
//           acc.totalRoundoffAmount += parseFloat(row.totalRoundoffAmount || '0');
//           return acc;
//         },
//         {
//           totalInvoiceItemAmount: 0,
//           totalTaxAmount: 0,
//           totalInvoiceAmount: 0,
//           totalRoundoffAmount: 0,
//         },
//       );
//     }

//     // Return API summary for unfiltered data
//     return reportData.summary;
//   };

//   // Get paginated data
//   const getPaginatedData = (): InvoiceRow[] => {
//     const startIndex = (currentPage - 1) * entriesPerPage;
//     const endIndex = startIndex + entriesPerPage;
//     return filteredData.slice(startIndex, endIndex);
//   };

//   // Calculate total pages
//   const totalPages = Math.ceil(filteredData.length / entriesPerPage);

//   // Handle page navigation
//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   // Export functionality placeholder
//   const handleExport = () => {
//     Alert.alert('Export Data', 'Choose export format:', [
//       {text: 'Excel', onPress: () => console.log('Export to Excel')},
//       {text: 'PDF', onPress: () => console.log('Export to PDF')},
//       {text: 'Cancel', style: 'cancel'},
//     ]);
//   };

//   // Render search filters summary
//   const renderFiltersUsed = (): React.JSX.Element | null => {
//     if (!searchFilters) return null;

//     const activeFilters: string[] = [];
//     if (searchFilters.customerName)
//       activeFilters.push(`Customer: ${searchFilters.customerName}`);
//     if (searchFilters.billNo)
//       activeFilters.push(`Bill No: ${searchFilters.billNo}`);
//     if (searchFilters.unit) activeFilters.push(`Unit: ${searchFilters.unit}`);
//     if (searchFilters.fromDate)
//       activeFilters.push(`From: ${searchFilters.fromDate}`);
//     if (searchFilters.toDate) activeFilters.push(`To: ${searchFilters.toDate}`);

//     if (activeFilters.length === 0) return null;

//     return (
//       <View style={styles.filtersContainer}>
//         <Text style={styles.filtersTitle}>Applied Filters:</Text>
//         <Text style={styles.filtersText}>{activeFilters.join(' | ')}</Text>
//       </View>
//     );
//   };

//   // Render summary cards
//   const renderSummary = (): React.JSX.Element | null => {
//     const summary = calculateSummary();
//     if (!summary) return null;

//     return (
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.summaryScrollView}>
//         <View style={styles.summaryContainer}>
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryCardTitle}>Total Records</Text>
//             <Text style={styles.summaryCardValue}>{filteredData.length}</Text>
//           </View>

//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryCardTitle}>Invoice Item Amount</Text>
//             <Text style={styles.summaryCardValue}>
//               ₹{formatCurrency(summary.totalInvoiceItemAmount)}
//             </Text>
//           </View>

//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryCardTitle}>Tax Amount</Text>
//             <Text style={styles.summaryCardValue}>
//               ₹{formatCurrency(summary.totalTaxAmount)}
//             </Text>
//           </View>

//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryCardTitle}>Invoice Amount</Text>
//             <Text style={styles.summaryCardValue}>
//               ₹{formatCurrency(summary.totalInvoiceAmount)}
//             </Text>
//           </View>

//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryCardTitle}>Roundoff Amount</Text>
//             <Text style={styles.summaryCardValue}>
//               ₹{formatCurrency(summary.totalRoundoffAmount)}
//             </Text>
//           </View>
//         </View>
//       </ScrollView>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search..."
//           value={searchText}
//           onChangeText={handleSearch}
//         />
//         <TouchableOpacity onPress={handleExport}>
//           <Icon name="file-download" size={28} color="#007bff" />
//         </TouchableOpacity>
//       </View>

//       {renderFiltersUsed()}
//       {renderSummary()}

//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <ScrollView horizontal>
//           <View style={styles.tableContainer}>
//             <Table borderStyle={{borderWidth: 1, borderColor: '#ccc'}}>
//               <Row
//                 data={reportData?.headers || []}
//                 style={styles.tableHeader}
//                 textStyle={styles.tableHeaderText}
//                 widthArr={[60, 120, 120, 140, 120, 140, 140]}
//               />
//               <Rows
//                 data={getPaginatedData().map((row: InvoiceRow) => [
//                   row.srNo,
//                   row.billNo,
//                   row.invoiceDate,
//                   `₹${formatCurrency(row.totalInvoiceItemAmount)}`,
//                   `₹${formatCurrency(row.totalTaxAmount)}`,
//                   `₹${formatCurrency(row.totalInvoiceAmount)}`,
//                   `₹${formatCurrency(row.totalRoundoffAmount)}`,
//                 ])}
//                 textStyle={styles.tableText}
//                 widthArr={[60, 120, 120, 140, 120, 140, 140]}
//               />
//             </Table>
//           </View>
//         </ScrollView>
//       )}

//       {/* Pagination Controls */}
//       <View style={styles.paginationContainer}>
//         <TouchableOpacity
//           onPress={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           style={styles.pageButton}>
//           <Text style={styles.pageButtonText}>{'<'}</Text>
//         </TouchableOpacity>
//         <Text style={styles.pageIndicator}>
//           Page {currentPage} of {totalPages}
//         </Text>
//         <TouchableOpacity
//           onPress={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           style={styles.pageButton}>
//           <Text style={styles.pageButtonText}>{'>'}</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#f9f9f9', padding: 10},
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   searchInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginRight: 10,
//     height: 40,
//     backgroundColor: '#fff',
//   },
//   filtersContainer: {marginBottom: 10},
//   filtersTitle: {fontWeight: 'bold', color: '#333'},
//   filtersText: {color: '#555'},
//   summaryScrollView: {marginBottom: 10},
//   summaryContainer: {flexDirection: 'row'},
//   summaryCard: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 10,
//     marginRight: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     shadowOffset: {width: 0, height: 2},
//     minWidth: 150,
//     alignItems: 'center',
//   },
//   summaryCardTitle: {color: '#555', fontSize: 14},
//   summaryCardValue: {color: '#000', fontSize: 16, fontWeight: 'bold'},
//   tableContainer: {marginBottom: 10},
//   tableHeader: {height: 40, backgroundColor: '#007bff'},
//   tableHeaderText: {textAlign: 'center', color: '#fff', fontWeight: 'bold'},
//   tableText: {textAlign: 'center', padding: 5},
//   paginationContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   pageButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     backgroundColor: '#007bff',
//     borderRadius: 5,
//     marginHorizontal: 10,
//   },
//   pageButtonText: {color: '#fff', fontSize: 16},
//   pageIndicator: {fontSize: 16, color: '#333'},
// });

// export default InvoiceReportScreen;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Interfaces (updated to include paymentStatus)
interface InvoiceRow {
  srNo: string;
  billNo: string;
  invoiceDate: string;
  totalInvoiceItemAmount: string;
  totalTaxAmount: string;
  totalInvoiceAmount: string;
  totalRoundoffAmount: string;
  invoiceOutstandingAmount: string; // new
  paymentStatus: string; // new - "PAID" or "DUE"
}

interface SummaryData {
  totalInvoiceItemAmount: number;
  totalTaxAmount: number;
  totalInvoiceAmount: number;
  totalRoundoffAmount: number;
  invOutstandingAmount: number; // new
  paidInvoices: number; // new
  dueInvoices: number; // new
}

interface SearchFilters {
  customerName?: string;
  billNo?: string;
  unit?: string;
  fromDate?: string;
  toDate?: string;
}

interface ReportData {
  reportData: string[][];
  headers: string[];
  summary: SummaryData;
}

interface RouteParams {
  reportData?: ReportData;
  searchFilters?: SearchFilters;
}

interface InvoiceReportScreenProps {
  route: {params?: RouteParams};
  navigation: any;
}

const InvoiceReportScreen: React.FC<InvoiceReportScreenProps> = ({
  route,
  navigation,
}) => {
  const {reportData, searchFilters} = route.params || {};

  const [filteredData, setFilteredData] = useState<InvoiceRow[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage] = useState<number>(10);

  // Toggle state: 'REPORT' = all, 'DUE' = only due
  const [viewMode, setViewMode] = useState<'REPORT' | 'DUE'>('REPORT');

  useEffect(() => {
    if (reportData && reportData.reportData) {
      const formattedData: InvoiceRow[] = reportData.reportData.map(
        (row, index) => ({
          srNo: row[0] || `${index + 1}`,
          billNo: row[1] || '',
          invoiceDate: row[2] || '',
          totalInvoiceItemAmount: row[3] || '0',
          totalTaxAmount: row[4] || '0',
          totalInvoiceAmount: row[5] || '0',
          totalRoundoffAmount: row[6] || '0',
          invoiceOutstandingAmount: row[8] || '0', // column 9 (0-indexed)
          paymentStatus: row[9] || 'DUE', // column 10 (0-indexed)
        }),
      );

      let data = formattedData;

      // Filter for DUE view
      if (viewMode === 'DUE') {
        data = data.filter(row => row.paymentStatus === 'DUE');
      }

      // Apply search
      if (searchText.trim()) {
        data = data.filter(row =>
          Object.values(row).some(value =>
            value?.toString().toLowerCase().includes(searchText.toLowerCase()),
          ),
        );
      }

      setFilteredData(data);
      setCurrentPage(1);
    }
  }, [reportData, viewMode, searchText]);

  const formatCurrency = (amount: string | number): string => {
    const num = parseFloat(amount?.toString() || '0');
    return isNaN(num)
      ? '0.00'
      : num.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

  const getPaginatedData = (): InvoiceRow[] => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredData.slice(start, start + entriesPerPage);
  };

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleExport = () => {
    Alert.alert('Export Data', 'Choose export format:', [
      {text: 'Excel', onPress: () => console.log('Export to Excel')},
      {text: 'PDF', onPress: () => console.log('Export to PDF')},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const renderFiltersUsed = () => {
    if (!searchFilters) return null;
    const filters: string[] = [];
    if (searchFilters.customerName)
      filters.push(`Customer: ${searchFilters.customerName}`);
    if (searchFilters.billNo) filters.push(`Bill No: ${searchFilters.billNo}`);
    if (searchFilters.unit) filters.push(`Unit: ${searchFilters.unit}`);
    if (searchFilters.fromDate) filters.push(`From: ${searchFilters.fromDate}`);
    if (searchFilters.toDate) filters.push(`To: ${searchFilters.toDate}`);
    return filters.length ? (
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Applied Filters:</Text>
        <Text style={styles.filtersText}>{filters.join(' | ')}</Text>
      </View>
    ) : null;
  };

  const renderSummary = () => {
    const summary = reportData?.summary;
    if (!summary) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.summaryScrollView}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>Total Records</Text>
            <Text style={styles.summaryCardValue}>{filteredData.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>Invoice Item Amount</Text>
            <Text style={styles.summaryCardValue}>
              ₹{formatCurrency(summary.totalInvoiceItemAmount)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>Tax Amount</Text>
            <Text style={styles.summaryCardValue}>
              ₹{formatCurrency(summary.totalTaxAmount)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>Invoice Amount</Text>
            <Text style={styles.summaryCardValue}>
              ₹{formatCurrency(summary.totalInvoiceAmount)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>Roundoff Amount</Text>
            <Text style={styles.summaryCardValue}>
              ₹{formatCurrency(summary.totalRoundoffAmount)}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={handleExport}>
          <Icon name="file-download" size={28} color="#007bff" />
        </TouchableOpacity>
      </View>

      {renderFiltersUsed()}
      {renderSummary()}

      {/* Toggle: Invoice Report vs Invoice Due */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'REPORT' && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode('REPORT')}>
          <Text
            style={[
              styles.toggleButtonText,
              viewMode === 'REPORT' && styles.toggleButtonTextActive,
            ]}>
            Invoice Report ({reportData?.summary?.paidInvoices || 0})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'DUE' && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode('DUE')}>
          <Text
            style={[
              styles.toggleButtonText,
              viewMode === 'DUE' && styles.toggleButtonTextActive,
            ]}>
            Invoice Due ({reportData?.summary?.dueInvoices || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {filteredData.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            No {viewMode === 'DUE' ? 'due ' : ''}invoices found.
          </Text>
        </View>
      ) : (
        <ScrollView horizontal>
          <View style={styles.tableContainer}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#ccc'}}>
              <Row
                data={reportData?.headers || []}
                style={styles.tableHeader}
                textStyle={styles.tableHeaderText}
                widthArr={[60, 120, 120, 140, 120, 140, 140]}
              />
              <Rows
                data={getPaginatedData().map(row => [
                  row.srNo,
                  row.billNo,
                  row.invoiceDate,
                  `₹${formatCurrency(row.totalInvoiceItemAmount)}`,
                  `₹${formatCurrency(row.totalTaxAmount)}`,
                  `₹${formatCurrency(row.totalInvoiceAmount)}`,
                  `₹${formatCurrency(row.totalRoundoffAmount)}`,
                  `₹${formatCurrency(row.invoiceOutstandingAmount)}`,
                  row.paymentStatus,
                ])}
                textStyle={styles.tableText}
                widthArr={[60, 120, 120, 140, 120, 140, 140]}
              />
            </Table>
          </View>
        </ScrollView>
      )}

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={styles.pageButton}>
          <Text style={styles.pageButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>
          Page {currentPage} of {totalPages || 1}
        </Text>
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={styles.pageButton}>
          <Text style={styles.pageButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9f9f9', padding: 10},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
    backgroundColor: '#fff',
  },
  filtersContainer: {marginBottom: 10},
  filtersTitle: {fontWeight: 'bold', color: '#333'},
  filtersText: {color: '#555'},
  summaryScrollView: {marginBottom: 10},
  summaryContainer: {flexDirection: 'row'},
  summaryCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    minWidth: 150,
    alignItems: 'center',
  },
  summaryCardTitle: {color: '#555', fontSize: 14},
  summaryCardValue: {color: '#000', fontSize: 16, fontWeight: 'bold'},
  tableContainer: {marginBottom: 10},
  tableHeader: {height: 40, backgroundColor: '#007bff'},
  tableHeaderText: {textAlign: 'center', color: '#fff', fontWeight: 'bold'},
  tableText: {textAlign: 'center', padding: 5},
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  pageButtonText: {color: '#fff', fontSize: 16},
  pageIndicator: {fontSize: 16, color: '#333'},

  // New toggle styles (matches your app's look)
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 5,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  toggleButtonActive: {
    backgroundColor: '#007bff',
  },
  toggleButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  noDataContainer: {},
  noDataText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
    fontSize: 16,
  },
});

export default InvoiceReportScreen;
