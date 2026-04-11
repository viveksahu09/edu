import React, { useState, useRef, useEffect } from "react";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { getAIResponse } from "../../services/ai";
import Message from "./Message";
import MessageInput from "./MessagesInput";
import FilePreview from "./FilePreview";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  attachments?: Array<{
    type: "image" | "document" | "video";
    url: string;
    name: string;
  }>;
}

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { isListening, startListening, stopListening, transcript } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && files.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      attachments: files.map((file) => ({
        type: file.type.startsWith("image/") ? "image" : "document",
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(input, files);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          isUser: false,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content:
            "I apologize, but I'm having trouble processing your request. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
      setFiles([]);
    }
  };

  const handleFileSelect = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg`}
    >
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <Message key={message.id} {...message} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {files.length > 0 && (
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
        </div>
      )}

      <MessageInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onFileSelect={handleFileSelect}
        onVoiceStart={startListening}
        onVoiceStop={stopListening}
        isRecording={isListening}
      />
    </div>
  );
}
