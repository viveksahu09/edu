import React, { useRef } from "react";
import { Send, Paperclip, Mic } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onFileSelect: (files: FileList) => void;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
  isRecording: boolean;
}

export default function MessageInput({
  value,
  onChange,
  onSend,
  onFileSelect,
  onVoiceStart,
  onVoiceStop,
  isRecording,
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-center space-x-2 p-4 border-t dark:border-gray-700">
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <Paperclip className="w-5 h-5" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => e.target.files && onFileSelect(e.target.files)}
      />

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="flex-1 resize-none p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        rows={1}
      />

      <button
        onMouseDown={onVoiceStart}
        onMouseUp={onVoiceStop}
        onMouseLeave={onVoiceStop}
        className={`p-2 rounded-full ${
          isRecording
            ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        }`}
      >
        <Mic className="w-5 h-5" />
      </button>

      <button
        onClick={onSend}
        disabled={!value.trim()}
        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
