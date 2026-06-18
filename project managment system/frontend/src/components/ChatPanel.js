import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import socketService from '../services/socketService';

// Enhanced time formatting with date support
const formatTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (isYesterday) {
    return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};

// Format full date for date separators
const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString();
  
  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

// Check if two messages should be grouped together
const shouldGroupMessages = (msg1, msg2) => {
  if (!msg1 || !msg2) return false;
  if (msg1.sender?._id !== msg2.sender?._id && 
      msg1.sender !== msg2.sender && 
      msg1.sender?._id !== msg2.sender?._id) return false;
  
  const time1 = new Date(msg1.createdAt).getTime();
  const time2 = new Date(msg2.createdAt).getTime();
  return Math.abs(time2 - time1) < 300000; // 5 minutes
};

export default function ChatPanel({ projectId, project, onClose }) {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const joinedProjectRef = useRef(null);

  const uniqueMessages = (list) => {
    const seen = new Set();
    return list
      .filter((m) => {
        const key = m?._id || m?.id || m?.createdAt;
        if (!key) return true;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  // Group messages for better display
  const groupedMessages = useMemo(() => {
    if (!messages.length) return [];
    
    const grouped = [];
    let currentGroup = null;
    
    messages.forEach((msg, index) => {
      const prevMsg = index > 0 ? messages[index - 1] : null;
      const showDateSeparator = !prevMsg || 
        new Date(msg.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString();
      
      if (showDateSeparator) {
        if (currentGroup) grouped.push(currentGroup);
        currentGroup = {
          date: formatDate(msg.createdAt),
          messages: [msg],
          showDate: true
        };
      } else {
        const shouldGroup = shouldGroupMessages(prevMsg, msg);
        if (shouldGroup && currentGroup) {
          currentGroup.messages.push(msg);
        } else {
          if (currentGroup) grouped.push(currentGroup);
          currentGroup = {
            date: formatDate(msg.createdAt),
            messages: [msg],
            showDate: false
          };
        }
      }
    });
    
    if (currentGroup) grouped.push(currentGroup);
    return grouped;
  }, [messages]);

  // Ensure socket connection
  useEffect(() => {
    if (token) {
      socketService.connect(token);
    }
  }, [token]);

  // Join room, fetch messages when project changes
  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    const fetchMessages = async () => {
      try {
        const res = await chatAPI.getMessages(projectId);
        setMessages(uniqueMessages(res.data || []));
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load chat');
      } finally {
        setLoading(false);
      }
    };

    // leave previous room
    if (joinedProjectRef.current && joinedProjectRef.current !== projectId) {
      socketService.leaveProject(joinedProjectRef.current);
    }
    socketService.joinProject(projectId);
    joinedProjectRef.current = projectId;
    fetchMessages();
  }, [projectId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    if (!projectId) return;

    const handleChatMessage = (msg) => {
      if (msg.project !== projectId) return;
      setMessages((prev) => uniqueMessages([...prev, { ...msg, reactions: msg.reactions || [] }]));
    };

    const handleChatUpdated = (msg) => {
      if (msg.project !== projectId) return;
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, ...msg, reactions: msg.reactions || m.reactions || [] } : m))
      );
    };

    const handleChatDeleted = (msg) => {
      if (msg.project !== projectId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m._id === msg._id ? { ...m, deletedAt: msg.deletedAt, text: 'This message was deleted' } : m
        )
      );
    };

    const handleTyping = (payload) => {
      if (payload?.isTyping && payload.projectId === projectId) {
        setTypingUsers((prev) => ({
          ...prev,
          [payload.userId]: { name: payload.userName, at: Date.now() },
        }));
      } else if (!payload?.isTyping && payload?.userId) {
        setTypingUsers((prev) => {
          const copy = { ...prev };
          delete copy[payload.userId];
          return copy;
        });
      }
    };

    const handleRead = ({ messageIds, userId, readAt, projectId: msgProjectId }) => {
      if (!messageIds || !userId || msgProjectId !== projectId) return;
      const currentUserId = user?.id || user?._id;
      if (userId?.toString() === currentUserId?.toString()) return;
      
      setMessages((prev) =>
        prev.map((m) => {
          if (!messageIds.includes(m._id)) return m;
          const readBy = m.readBy || [];
          const alreadyRead = readBy.some(r => {
            const readUserId = r.user?._id?.toString() || r.user?.toString() || r.user;
            return readUserId === userId?.toString();
          });
          if (alreadyRead) return m;
          return { ...m, readBy: [...readBy, { user: userId, readAt }] };
        })
      );
    };

    const handleReaction = ({ _id, reactions, projectId: msgProjectId }) => {
      if (msgProjectId !== projectId) return;
      setMessages((prev) =>
        prev.map((m) => {
          if (m._id === _id) {
            return { ...m, reactions: reactions || [] };
          }
          return m;
        })
      );
    };

    socketService.onChatMessage(handleChatMessage);
    socketService.onChatUpdated(handleChatUpdated);
    socketService.onChatDeleted(handleChatDeleted);
    socketService.onTyping(handleTyping);
    socketService.onRead(handleRead);
    socketService.onReaction(handleReaction);

    return () => {
      socketService.off('chat:message', handleChatMessage);
      socketService.off('chat:updated', handleChatUpdated);
      socketService.off('chat:deleted', handleChatDeleted);
      socketService.off('chat:typing', handleTyping);
      socketService.off('chat:read', handleRead);
      socketService.off('chat:reaction', handleReaction);
    };
  }, [projectId, user]);

  // Clear stale typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers((prev) => {
        const filtered = Object.fromEntries(
          Object.entries(prev).filter(([, value]) => now - value.at < 3000)
        );
        return filtered;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || !projectId) return;
    setInput('');
    try {
      const res = await chatAPI.sendMessage(projectId, { text: content });
      const msg = res.data;
      setMessages((prev) => uniqueMessages([...prev, msg]));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  const startEdit = (msg) => {
    setEditingId(msg._id);
    setEditText(msg.text);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingId || !projectId || !editText.trim()) return;
    try {
      const res = await chatAPI.updateMessage(projectId, editingId, { text: editText.trim() });
      const msg = res.data;
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, ...msg } : m)));
      setEditingId('');
      setEditText('');
      socketService.emitChatUpdate(projectId, msg._id, msg.text);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to edit message');
    }
  };

  const handleDelete = async (id) => {
    if (!id || !projectId) return;
    try {
      const res = await chatAPI.deleteMessage(projectId, id);
      const msg = res.data;
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, ...msg } : m)));
      socketService.emitChatDelete(projectId, id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete message');
    }
  };

  const handleReactionClick = async (messageId, emoji) => {
    if (!messageId || !projectId || !emoji) return;
    
    const userId = user?.id || user?._id;
    const message = messages.find(m => m._id === messageId);
    if (!message) return;

    const reactions = message.reactions || [];
    const reaction = reactions.find(r => r.emoji === emoji);
    const hasReacted = reaction?.users?.some(u => {
      const uId = u?._id?.toString() || u?.toString() || u;
      return uId === userId?.toString();
    });

    try {
      let response;
      if (hasReacted) {
        response = await chatAPI.removeReaction(projectId, messageId, emoji);
      } else {
        response = await chatAPI.addReaction(projectId, messageId, emoji);
      }
      
      const updatedMessage = response?.data;
      if (updatedMessage && updatedMessage.reactions) {
        setMessages((prev) =>
          prev.map((m) => {
            if (m._id === messageId) {
              return { ...m, reactions: updatedMessage.reactions || [] };
            }
            return m;
          })
        );
      }
    } catch (err) {
      console.error('Reaction error:', err);
      setError(err.response?.data?.message || 'Failed to update reaction');
    }
  };

  const commonEmojis = ['👍', '❤️', '😄', '😮', '😢', '🙏', '👏', '🔥'];

  // Typing indicator emission
  useEffect(() => {
    if (!projectId) return;
    socketService.emitTyping(projectId, input.length > 0);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketService.emitTyping(projectId, false);
    }, 1200);
    return () => clearTimeout(typingTimeout.current);
  }, [input, projectId]);

  // Mark messages as read when visible (debounced)
  useEffect(() => {
    if (!projectId || !user || messages.length === 0) return;
    
    const markAsRead = () => {
      const userId = user.id || user._id;
      const unread = messages
        .filter((m) => {
          if (!m._id) return false;
          const readBy = m.readBy || [];
          return !readBy.some((r) => {
            const readUserId = r.user?._id || r.user?.toString() || r.user;
            return readUserId === userId?.toString() || readUserId === userId;
          });
        })
        .map((m) => m._id)
        .filter(Boolean);
      
      if (unread.length > 0) {
        chatAPI.markRead(projectId, unread).catch(() => {});
        socketService.emitRead(projectId, unread);
      }
    };

    const timeoutId = setTimeout(markAsRead, 1000);
    return () => clearTimeout(timeoutId);
  }, [messages, projectId, user]);

  if (!projectId) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={onClose}
      />
      <div 
        className="fixed bottom-6 right-6 w-full md:w-96 md:max-h-[80vh] h-[90vh] md:h-auto bg-white shadow-2xl z-40 flex flex-col rounded-2xl border border-slate-200 overflow-hidden"
        style={{
          animation: 'slideInRight 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {(project?.name || 'P').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-sm">Team Chat</h3>
              <p className="text-xs text-white/90">{project?.name || 'Project'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors hover:scale-110"
            title="Close chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-sm">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 rounded-full p-0.5 hover:bg-red-100 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-slate-50 to-slate-100">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-cyan-500 border-t-transparent"></div>
              <p className="text-xs text-slate-600 font-medium">Loading messages...</p>
            </div>
          </div>
        )}
        {messages.length === 0 && !loading && (
          <div className="flex items-center justify-center h-full flex-col">
            <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-sm font-medium text-slate-900">No messages yet</p>
            <p className="text-xs text-slate-600 mt-1">Start the conversation!</p>
          </div>
        )}
        {!loading && groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            {group.showDate && (
              <div className="flex items-center justify-center my-4">
                <div className="px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                  <span className="text-xs font-medium text-slate-600">{group.date}</span>
                </div>
              </div>
            )}
            <div className="space-y-1">
              {group.messages.map((msg, msgIndex) => {
                const userId = user?.id || user?._id;
                const senderId = msg.sender?._id || msg.sender;
                const isMine = senderId?.toString() === userId?.toString();
                const readBy = msg.readBy || [];
                const readCount = readBy.filter(r => {
                  const readUserId = r.user?._id?.toString() || r.user?.toString() || r.user;
                  return readUserId && readUserId !== userId?.toString();
                }).length;
                const isDeleted = !!msg.deletedAt;
                const showSenderInfo = !isMine && (msgIndex === 0 || !shouldGroupMessages(group.messages[msgIndex - 1], msg));
                const showTimestamp = msgIndex === group.messages.length - 1 || 
                  !shouldGroupMessages(msg, group.messages[msgIndex + 1]);
                
                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col gap-0.5 ${isMine ? 'items-end' : 'items-start'} ${showSenderInfo ? 'mt-2' : 'mt-0.5'}`}
                  >
                    {showSenderInfo && !isMine && (
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
                          {(msg.sender?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold text-slate-900">{msg.sender?.name || 'User'}</span>
                        {showTimestamp && (
                          <span className="text-xs text-slate-600">{formatTime(msg.createdAt)}</span>
                        )}
                      </div>
                    )}
                    <div className={`flex items-end gap-1.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                      {isMine && showTimestamp && (
                        <span className="text-xs text-slate-600 mb-0.5 px-1 min-w-[50px] text-right">
                          {formatTime(msg.createdAt)}
                        </span>
                      )}
                      <div className="flex flex-col gap-0.5">
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-xs max-w-[200px] break-words shadow-sm ${
                            isMine
                              ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white'
                              : 'bg-white text-slate-900 border border-slate-200'
                          } ${isDeleted ? 'opacity-60 italic' : ''}`}
                        >
                          {editingId === msg._id && !isDeleted ? (
                            <form onSubmit={submitEdit} className="flex gap-2 items-center">
                              <input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className={`flex-1 rounded-xl px-3 py-1.5 text-xs ${
                                  isMine
                                    ? 'bg-white/20 border border-white/30 text-white placeholder-white/70'
                                    : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500'
                                } focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                                autoFocus
                              />
                              <button type="submit" className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium transition-all shadow-sm">Save</button>
                              <button
                                type="button"
                                onClick={() => { setEditingId(''); setEditText(''); }}
                                className="text-xs px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <span className="whitespace-pre-wrap">{msg.text}</span>
                          )}
                        </div>
                        {/* Reactions */}
                        {!isDeleted && (
                          <div className={`flex flex-wrap items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                            {commonEmojis.map((emoji) => {
                              const userId = user?.id || user?._id;
                              const existingReaction = (msg.reactions || []).find(r => r.emoji === emoji);
                              const hasReacted = existingReaction?.users?.some(u => {
                                const uId = u?._id?.toString() || u?.toString() || u;
                                return uId === userId?.toString();
                              });
                              const reactionCount = existingReaction?.users?.length || 0;
                              
                              if (reactionCount === 0 && !hasReacted) {
                                return (
                                  <button
                                    key={emoji}
                                    onClick={() => handleReactionClick(msg._id, emoji)}
                                    className="w-6 h-6 flex items-center justify-center rounded-full text-xs hover:bg-slate-200 border border-transparent hover:border-slate-300 hover:scale-110 opacity-60 hover:opacity-100 transition-all"
                                    title="Click to react"
                                  >
                                    <span className="leading-none">{emoji}</span>
                                  </button>
                                );
                              }
                              
                              return (
                                <button
                                  key={emoji}
                                  onClick={() => handleReactionClick(msg._id, emoji)}
                                  className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-xs transition-all hover:scale-105 shadow-sm ${
                                    hasReacted
                                      ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white'
                                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                                  }`}
                                  title={hasReacted ? 'Click to remove' : 'Click to add'}
                                >
                                  <span className="leading-none">{emoji}</span>
                                  {reactionCount > 0 && (
                                    <span className={`text-[10px] font-semibold ${hasReacted ? 'text-white' : 'text-slate-600'}`}>
                                      {reactionCount}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {isMine && !isDeleted && editingId !== msg._id && (
                          <div className="flex gap-1.5 text-[10px] text-slate-600 px-1 justify-end">
                            <button
                              onClick={() => startEdit(msg)}
                              className="hover:text-cyan-600 transition-colors"
                            >
                              Edit
                            </button>
                            <span className="text-slate-400">•</span>
                            <button
                              onClick={() => handleDelete(msg._id)}
                              className="hover:text-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        {(msg.editedAt || isDeleted || readCount > 0) && (
                          <div className={`flex items-center gap-1 text-[10px] text-slate-600 px-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                            {msg.editedAt && !isDeleted && <span className="italic">(edited)</span>}
                            {isDeleted && <span className="italic">Deleted</span>}
                            {readCount > 0 && !isDeleted && (
                              <span className="flex items-center gap-0.5">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                                {readCount}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      <div className="px-4 py-2 text-[10px] text-slate-600 min-h-[24px] bg-white border-t border-slate-200 flex items-center">
        {Object.values(typingUsers).length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span className="font-medium text-slate-700">
              {Object.values(typingUsers).map((t) => t.name || 'Someone').join(', ')} {Object.values(typingUsers).length === 1 ? 'is' : 'are'} typing...
            </span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-xl px-4 py-2.5 text-xs bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-xs hover:from-cyan-600 hover:to-blue-600 active:from-cyan-700 active:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
            title="Send message (Enter)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
      </div>
    </>
  );
}

