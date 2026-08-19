import React, { useState } from 'react';
import { MessageSquare, Sparkles, Send, User, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useChatHistory, chatKeys } from '../../hooks/useChat';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clearChatHistory } from '../../services/project.api';
import ConfirmDialog from './ConfirmDialog';

const ModuleChat = ({ 
  moduleType, 
  title, 
  description, 
  placeholder, 
  suggestedQuestions, 
  onAskQuestion 
}) => {
  const { projectId } = useParams();
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  
  const { data: initialHistory } = useChatHistory(projectId, moduleType);

  // Replaces the specific hooks (like useAskMVPQuestion) with a generic mutation
  const { mutate: askQuestion, isPending } = useMutation({
    mutationFn: (q) => onAskQuestion(projectId, q)
  });

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: clearChat, isPending: isClearing } = useMutation({
    mutationFn: () => clearChatHistory(projectId, moduleType),
    onSuccess: () => {
      setChatHistory([]);
      try {
        queryClient.setQueryData(chatKeys.list(projectId, moduleType), []);
      } catch (e) {
        queryClient.invalidateQueries(chatKeys.list(projectId, moduleType));
      }
      setIsClearModalOpen(false);
    },
  });

  const handleClearClick = () => {
    if (chatHistory.length === 0) return;
    setIsClearModalOpen(true);
  };

  // Sync initial history to local state
  React.useEffect(() => {
    if (initialHistory && initialHistory.length > 0) {
      setChatHistory(initialHistory);
    }
  }, [initialHistory]);

  const handleSubmit = (q) => {
    const textToSubmit = typeof q === 'string' ? q : question;
    if (!textToSubmit.trim() || isPending) return;

    setChatHistory(prev => [...prev, { role: 'user', content: textToSubmit }]);
    setQuestion('');

    askQuestion(textToSubmit, {
      onSuccess: (answer) => {
        // Update local UI
        setChatHistory(prev => [...prev, { role: 'ai', content: answer }]);

        // Keep react-query cache in sync so history is available after navigation
        try {
          queryClient.setQueryData(chatKeys.list(projectId, moduleType), (old) => {
            const existing = Array.isArray(old) ? old.slice() : [];
            const last = existing[existing.length - 1];

            if (!last || last.content !== textToSubmit || last.role !== 'user') {
              existing.push({ role: 'user', content: textToSubmit });
            }

            const lastAfter = existing[existing.length - 1];
            if (!lastAfter || lastAfter.content !== answer || lastAfter.role !== 'ai') {
              existing.push({ role: 'ai', content: answer });
            }

            return existing;
          });
        } catch (e) {
          queryClient.invalidateQueries(chatKeys.list(projectId, moduleType));
        }
      },
      onError: () => {
        setChatHistory(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered an error processing your request." }]);
      }
    });
  };

  const formatMessage = (content) => {
    if (!content) return null;
    return content.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-bold text-text-primary">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={i} className="block mb-2 last:mb-0">
          {formattedLine}
        </span>
      );
    });
  };

  return (
    <div className="mt-12 bg-surface border border-border rounded-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Sparkles className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-text-primary">{title}</h3>
            <p className="text-text-secondary text-sm">{description}</p>
          </div>
        </div>
        {chatHistory.length > 0 && (
          <button
            onClick={handleClearClick}
            disabled={isClearing}
            title="Clear chat history"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-danger hover:bg-danger/10 transition-all duration-200"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                </div>
                <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-secondary/10 border border-secondary/20 text-text-primary rounded-tr-none' : 'bg-background border border-border text-text-secondary rounded-tl-none'}`}>
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}
            {isPending && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary/20 text-primary">
                  <Sparkles size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-background border border-border text-text-secondary rounded-tl-none">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative">
          <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={placeholder} 
            className="w-full bg-background border border-border rounded-lg pl-4 pr-12 py-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
            disabled={isPending}
          />
          <button 
            type="submit"
            disabled={!question.trim() || isPending}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>

        {/* Suggested Questions */}
        {chatHistory.length === 0 && suggestedQuestions && (
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Suggested Questions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSubmit(q)}
                  disabled={isPending}
                  className="flex items-center gap-2 bg-background border border-border hover:border-primary/50 text-text-secondary hover:text-text-primary text-sm px-4 py-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare size={14} />
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={() => clearChat()}
        title="Clear Chat History"
        message="Are you sure you want to clear all messages? This action cannot be undone."
        confirmText="Clear Chat"
        isDestructive={true}
        isPending={isClearing}
      />
    </div>
  );
};

export default ModuleChat;
