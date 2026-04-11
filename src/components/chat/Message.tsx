import React from "react";
import { Volume2, StopCircle, Download } from "lucide-react";
import { useTextToSpeech } from "../../hooks/userTextToSpeech";

interface MessageProps {
  content: string;
  isUser: boolean;
  attachments?: Array<{
    type: "image" | "document" | "video";
    url: string;
    name: string;
  }>;
}

export default function Message({
  content,
  isUser,
  attachments,
}: MessageProps) {
  const { speak, stop, isSpeaking } = useTextToSpeech();

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>

        {(attachments?.length ?? 0) > 0 && (
          <div className="mt-2 space-y-2">
            {attachments?.map((attachment, index) => (
              <div key={index} className="flex items-center">
                {attachment.type === "image" ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="max-w-full h-auto rounded"
                  />
                ) : (
                  <a
                    href={attachment.url}
                    download={attachment.name}
                    className="flex items-center text-indigo-500 hover:text-indigo-600"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {attachment.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {!isUser && (
          <button
            onClick={() => (isSpeaking ? stop() : speak(content))}
            className="mt-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {isSpeaking ? (
              <StopCircle className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
