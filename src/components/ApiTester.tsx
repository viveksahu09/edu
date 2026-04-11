import React, { useState } from 'react';
import { Play, Copy, CheckCircle, AlertCircle, Code } from 'lucide-react';
import { apiService, ApiResponse } from '../services/api';

interface ApiTest {
  method: string;
  endpoint: string;
  body?: string;
  headers?: Record<string, string>;
  response?: any;
  error?: string;
  loading: boolean;
  status?: number;
}

export default function ApiTester() {
  const [tests, setTests] = useState<ApiTest[]>([
    {
      method: 'GET',
      endpoint: '/research/subjects',
      loading: false,
    },
    {
      method: 'GET',
      endpoint: '/research/topics',
      loading: false,
    },
    {
      method: 'POST',
      endpoint: '/auth/login',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
      loading: false,
    },
  ]);

  const [copiedResponse, setCopiedResponse] = useState<number | null>(null);

  const executeTest = async (index: number) => {
    const test = tests[index];
    
    setTests(prev => prev.map((t, i) => 
      i === index ? { ...t, loading: true, response: undefined, error: undefined } : t
    ));

    try {
      let response: ApiResponse<any>;
      
      switch (test.method.toUpperCase()) {
        case 'GET':
          response = await apiService.get(test.endpoint);
          break;
        case 'POST':
          response = await apiService.post(test.endpoint, test.body ? JSON.parse(test.body) : undefined);
          break;
        case 'PUT':
          response = await apiService.put(test.endpoint, test.body ? JSON.parse(test.body) : undefined);
          break;
        case 'DELETE':
          response = await apiService.delete(test.endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${test.method}`);
      }

      setTests(prev => prev.map((t, i) => 
        i === index ? { 
          ...t, 
          loading: false, 
          response: response, 
          status: response.success ? 200 : 400,
          error: response.error 
        } : t
      ));
    } catch (error) {
      setTests(prev => prev.map((t, i) => 
        i === index ? { 
          ...t, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 500
        } : t
      ));
    }
  };

  const addTest = () => {
    setTests(prev => [...prev, {
      method: 'GET',
      endpoint: '',
      loading: false,
    }]);
  };

  const updateTest = (index: number, field: keyof ApiTest, value: any) => {
    setTests(prev => prev.map((t, i) => 
      i === index ? { ...t, [field]: value } : t
    ));
  };

  const removeTest = (index: number) => {
    setTests(prev => prev.filter((_, i) => i !== index));
  };

  const copyResponse = async (response: any, index: number) => {
    try {
      const text = JSON.stringify(response, null, 2);
      await navigator.clipboard.writeText(text);
      setCopiedResponse(index);
      setTimeout(() => setCopiedResponse(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-green-100 text-green-800 border-green-200';
      case 'POST': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status?: number) => {
    if (!status) return '';
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-yellow-600';
    if (status >= 400 && status < 500) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  API Tester
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Test your API endpoints directly from the browser
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addTest}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add Test
              </button>
              <button
                onClick={() => Promise.all(tests.map((_, i) => executeTest(i)))}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Run All
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {tests.map((test, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <select
                      value={test.method}
                      onChange={(e) => updateTest(index, 'method', e.target.value)}
                      className={`px-3 py-1 text-sm font-medium rounded border ${getMethodColor(test.method)}`}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                    <input
                      type="text"
                      value={test.endpoint}
                      onChange={(e) => updateTest(index, 'endpoint', e.target.value)}
                      placeholder="/api/endpoint"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {test.status && (
                      <span className={`text-sm font-medium ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => executeTest(index)}
                      disabled={test.loading || !test.endpoint}
                      className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {test.loading ? 'Testing...' : 'Test'}
                    </button>
                    <button
                      onClick={() => removeTest(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {['POST', 'PUT'].includes(test.method) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Request Body (JSON)
                    </label>
                    <textarea
                      value={test.body || ''}
                      onChange={(e) => updateTest(index, 'body', e.target.value)}
                      placeholder='{"key": "value"}'
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
                    />
                  </div>
                )}
              </div>

              {(test.response || test.error) && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Response
                    </h3>
                    {test.response && (
                      <button
                        onClick={() => copyResponse(test.response, index)}
                        className="flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {copiedResponse === index ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        {copiedResponse === index ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>

                  {test.error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        <span className="text-red-800 dark:text-red-200 font-medium">Error</span>
                      </div>
                      <p className="text-red-700 dark:text-red-300 mt-2">{test.error}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(test.response, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {tests.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No API Tests Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add a test to start testing your API endpoints.
            </p>
            <button
              onClick={addTest}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Your First Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
