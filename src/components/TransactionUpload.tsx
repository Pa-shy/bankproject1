import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { dataAnalysisService } from '../utils/dataAnalysis';
import { useAnalysis } from '../contexts/AnalysisContext';
import { getAllCurrencies } from '../utils/currency';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  records?: number;
  dataType?: 'transactions' | 'charges' | 'auto';
}

export const TransactionUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { refreshData } = useAnalysis();
  const currencies = getAllCurrencies();

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      dataType: 'auto'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload process
    newFiles.forEach(file => {
      processFile(file.id, acceptedFiles.find(f => f.name === file.name)!);
    });
  };

  const processFile = async (fileId: string, file: File) => {
    try {
      // Update progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress < 90) {
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, progress } : f
          ));
        }
      }, 100);

      // Read file content
      const text = await file.text();
      let data: any[] = [];

      // Parse based on file type
      if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        data = parseCSV(text);
      } else if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else {
        throw new Error('Unsupported file format');
      }

      clearInterval(progressInterval);

      // Set processing status
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress: 100, status: 'processing' } : f
      ));

      // Analyze data to determine type
      const dataType = detectDataType(data);
      
      // Process the data
      const recordsAdded = dataAnalysisService.addUploadedData(data, dataType);

      // Update file status
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'completed',
          records: recordsAdded,
          dataType
        } : f
      ));

      // Refresh analysis data
      refreshData();

    } catch (error) {
      console.error('File processing error:', error);
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'error', progress: 0 } : f
      ));
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      data.push(row);
    }

    return data;
  };

  const detectDataType = (data: any[]): 'transactions' | 'charges' => {
    if (data.length === 0) return 'transactions';

    const firstRow = data[0];
    const keys = Object.keys(firstRow).map(k => k.toLowerCase());

    // Check for charge-specific fields
    if (keys.includes('charge_amount') || keys.includes('charge_id') || keys.includes('charge_type')) {
      return 'charges';
    }

    // Default to transactions
    return 'transactions';
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    // Refresh data after removing file
    refreshData();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Transaction Data</h2>
        <p className="text-gray-600 mb-6">
          Upload your transaction and charge data files for analysis. Supported formats: CSV, Excel, JSON, TXT.
        </p>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-gray-700 font-medium mb-1">
                Drag & drop files here, or click to select files
              </p>
              <p className="text-sm text-gray-500">
                Maximum file size: 100MB
              </p>
            </div>
          )}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
          
          <div className="space-y-4">
            {uploadedFiles.map(file => (
              <div key={file.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                      {file.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    {formatFileSize(file.size)} 
                    {file.records && ` • ${file.records.toLocaleString()} ${file.dataType} processed`}
                  </p>
                  
                  {(file.status === 'uploading' || file.status === 'processing') && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(file.status)}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">File Format Requirements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Transaction Data</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• transaction_id (required)</li>
              <li>• <strong>amount</strong> (required)</li>
              <li>• customer_id</li>
              <li>• currency (optional, defaults to USD)</li>
              <li>• timestamp</li>
              <li>• service_type</li>
              <li>• region</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Charge Data</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>transaction_id</strong> (required)</li>
              <li>• <strong>charge_amount</strong> (required)</li>
              <li>• charge_id</li>
              <li>• currency (optional, defaults to USD)</li>
              <li>• charge_type</li>
              <li>• applied_timestamp</li>
              <li>• status</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Supported Currencies</h4>
          <div className="flex flex-wrap gap-2">
            {currencies.map(currency => (
              <span key={currency.code} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {currency.symbol} {currency.code} - {currency.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};