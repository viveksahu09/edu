import React, { useState, useEffect } from 'react';
import { BookOpen, Code, Copy, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface SwaggerEndpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  parameters?: any[];
  requestBody?: any;
  responses?: any;
  tags?: string[];
}

interface SwaggerSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths: Record<string, any>;
  components?: {
    schemas?: Record<string, any>;
  };
}

export default function SwaggerViewer() {
  const [spec, setSpec] = useState<SwaggerSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<SwaggerEndpoint | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    loadSwaggerSpec();
  }, []);

  const loadSwaggerSpec = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api-docs/swagger.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load Swagger spec: ${response.status}`);
      }
      
      const swaggerSpec = await response.json();
      setSpec(swaggerSpec);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load API documentation');
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-green-100 text-green-800 border-green-200';
      case 'POST': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      case 'PATCH': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const extractEndpoints = (): SwaggerEndpoint[] => {
    if (!spec?.paths) return [];

    const endpoints: SwaggerEndpoint[] = [];
    
    Object.entries(spec.paths).forEach(([path, pathItem]) => {
      Object.entries(pathItem).forEach(([method, operation]) => {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
          endpoints.push({
            path,
            method,
            summary: (operation as any).summary || `${method.toUpperCase()} ${path}`,
            description: (operation as any).description || '',
            parameters: (operation as any).parameters || [],
            requestBody: (operation as any).requestBody,
            responses: (operation as any).responses,
            tags: (operation as any).tags || [],
          });
        }
      });
    });

    return endpoints.sort((a, b) => a.path.localeCompare(b.path));
  };

  const generateCurlCommand = (endpoint: SwaggerEndpoint): string => {
    const baseUrl = 'http://localhost:5000';
    let curl = `curl -X ${endpoint.method.toUpperCase()} \\\n`;
    curl += `  "${baseUrl}${endpoint.path}" \\\n`;
    curl += `  -H "Content-Type: application/json"`;
    
    if (endpoint.requestBody?.content?.['application/json']?.example) {
      const example = JSON.stringify(endpoint.requestBody.content['application/json'].example, null, 2);
      curl += ` \\\n  -d '${example}'`;
    }
    
    return curl;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load API Documentation</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadSwaggerSpec}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const endpoints = extractEndpoints();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  API Documentation
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {spec?.info?.title || 'API Documentation'} - {spec?.info?.version || '1.0.0'}
                </p>
              </div>
            </div>
            <a
              href="http://localhost:5000/api-docs/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Swagger UI
            </a>
          </div>
          
          {spec?.info?.description && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">{spec.info.description}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Endpoints List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  API Endpoints ({endpoints.length})
                </h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {endpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedEndpoint?.path === endpoint.path && selectedEndpoint?.method === endpoint.method
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method.toUpperCase()}
                      </span>
                      {endpoint.tags?.map(tag => (
                        <span key={tag} className="text-xs text-gray-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {endpoint.summary}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {endpoint.path}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Endpoint Details */}
          <div className="lg:col-span-2">
            {selectedEndpoint ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`px-3 py-1 text-sm font-medium rounded border ${getMethodColor(selectedEndpoint.method)} mr-3`}>
                        {selectedEndpoint.method.toUpperCase()}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedEndpoint.summary}
                      </h3>
                    </div>
                    <button
                      onClick={() => copyToClipboard(generateCurlCommand(selectedEndpoint), 'curl')}
                      className="flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {copiedCode === 'curl' ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      {copiedCode === 'curl' ? 'Copied!' : 'Copy cURL'}
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {selectedEndpoint.description}
                  </p>
                  <div className="mt-3 font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded">
                    {selectedEndpoint.path}
                  </div>
                </div>

                <div className="p-6">
                  {/* Parameters */}
                  {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Parameters</h4>
                      <div className="space-y-2">
                        {selectedEndpoint.parameters.map((param: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">{param.name}</span>
                              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({param.in})</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-600 dark:text-gray-400">{param.schema?.type}</span>
                              {param.required && (
                                <span className="ml-2 text-xs text-red-600">required</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Body */}
                  {selectedEndpoint.requestBody && (
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Request Body</h4>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm">
                          {JSON.stringify(
                            selectedEndpoint.requestBody.content?.['application/json']?.example || {},
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Responses */}
                  {selectedEndpoint.responses && (
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Responses</h4>
                      <div className="space-y-3">
                        {Object.entries(selectedEndpoint.responses).map(([status, response]: [string, any]) => (
                          <div key={status} className="border border-gray-200 dark:border-gray-700 rounded">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                              <div className="flex items-center">
                                <span className="font-medium text-gray-900 dark:text-white">Status: {status}</span>
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                  {response.description}
                                </span>
                              </div>
                            </div>
                            {response.content?.['application/json']?.example && (
                              <div className="p-3 bg-gray-900 text-gray-100">
                                <pre className="text-sm">
                                  {JSON.stringify(response.content['application/json'].example, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* cURL Command */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">cURL Command</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative">
                      <button
                        onClick={() => copyToClipboard(generateCurlCommand(selectedEndpoint), 'curl-full')}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white"
                      >
                        {copiedCode === 'curl-full' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <pre className="text-sm whitespace-pre-wrap">
                        {generateCurlCommand(selectedEndpoint)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select an Endpoint
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose an API endpoint from the list to view its documentation and examples.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
