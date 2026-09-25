import React, { useState, useEffect, useRef } from 'react';
import { 
  Hash, 
  MessageSquare, 
  Smile, 
  Paperclip, 
  Send, 
  Mic, 
  Search, 
  Sun, 
  Moon, 
  User, 
  MoreVertical, 
  Phone, 
  Video, 
  Info, 
  ThumbsUp, 
  Heart, 
  Laugh, 
  Flame, 
  Code, 
  Image, 
  CheckCheck, 
  X, 
  MessageCircle, 
  Bell, 
  Settings, 
  LogOut, 
  Plus, 
  Circle,
  Play,
  Pause,
  CornerUpLeft,
  Volume2,
  Trash2,
  Share2,
  Sparkles,
  Pin,
  Check
} from 'lucide-react';

const CURRENT_USER = {
  id: 'u_me',
  name: 'Alex Rivera',
  username: '@alexr',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  status: 'online',
  statusMsg: 'Coding awesome stuff 🚀'
};

const INITIAL_USERS = [
  { id: 'u1', name: 'Sarah Connor', username: '@sarah_c', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250', status: 'online', statusMsg: 'In a meeting 💻' },
  { id: 'u2', name: 'Marcus Chen', username: '@mchen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', status: 'online', statusMsg: 'Focusing 🎧' },
  { id: 'u3', name: 'Elena Rostova', username: '@elena_r', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250', status: 'idle', statusMsg: 'BRB - Lunch 🥗' },
  { id: 'u4', name: 'David Kim', username: '@dkim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250', status: 'offline', statusMsg: 'AFK' },
];

const INITIAL_ROOMS = [
  { id: 'r1', name: 'general', type: 'channel', description: 'General announcements and team discussions', unread: 0 },
  { id: 'r2', name: 'tech-talk', type: 'channel', description: 'Deep dive into code, frameworks, and tech news', unread: 2 },
  { id: 'r3', name: 'random', type: 'channel', description: 'Memes, random banter, and watercooler chat', unread: 0 },
  { id: 'r4', name: 'music-vibes', type: 'channel', description: 'Share what you are currently listening to 🎵', unread: 0 },
];

const INITIAL_MESSAGES = {
  'r1': [
    {
      id: 'm1',
      sender: INITIAL_USERS[0],
      text: 'Hey everyone! Welcome to **PulseChat**. Feel free to explore channels and direct messages! 🚀',
      time: '10:15 AM',
      reactions: { '❤️': ['u2', 'u_me'], '🔥': ['u1'] },
      replies: [
        { id: 'rep1', sender: CURRENT_USER, text: 'Looks sleek and super responsive!', time: '10:16 AM' }
      ]
    },
    {
      id: 'm2',
      sender: INITIAL_USERS[1],
      text: 'Does this chat support Markdown code blocks and voice notes?',
      time: '10:18 AM',
      reactions: { '👍': ['u_me'] },
      replies: []
    },
    {
      id: 'm3',
      sender: CURRENT_USER,
      text: 'Yes! Check out this snippet:\n```js\nconst pulseChat = {\n  version: "2.0",\n  speed: "Lightning fast ⚡"\n};\nconsole.log(pulseChat);\n```',
      time: '10:20 AM',
      reactions: { '🚀': ['u1', 'u2'] },
      replies: []
    }
  ],
  'r2': [
    {
      id: 'm4',
      sender: INITIAL_USERS[1],
      text: 'Are we adopting React 19 and Tailwind CSS for the upcoming release?',
      time: '09:30 AM',
      reactions: { '👀': ['u3'] },
      replies: []
    },
    {
      id: 'm5',
      sender: INITIAL_USERS[2],
      text: 'Here is a quick concept visual of the theme palette!',
      time: '09:45 AM',
      media: { type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800' },
      reactions: { '❤️': ['u1', 'u_me'] },
      replies: []
    }
  ],
  'u1': [
    {
      id: 'm6',
      sender: INITIAL_USERS[0],
      text: 'Hey Alex! Did you get a chance to review the latest design tokens?',
      time: '11:00 AM',
      reactions: {},
      replies: []
    }
  ]
};

const EMOJI_LIST = ['👍', '❤️', '🔥', '😂', '🎉', '🚀', '👀', '💯'];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('r1');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeThread, setActiveThread] = useState(null);
  const [threadInput, setThreadInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioStreamTime, setAudioStreamTime] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioStreamTime((prev) => prev + 1);
      }, 1000);
    } else {
      setAudioStreamTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const currentTarget = 
    INITIAL_ROOMS.find(r => r.id === activeTab) || 
    INITIAL_USERS.find(u => u.id === activeTab);

  const isChannel = INITIAL_ROOMS.some(r => r.id === activeTab);

  const handleSendMessage = (customData = {}) => {
    if (!inputText.trim() && !customData.media && !customData.audio) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: CURRENT_USER,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {},
      replies: [],
      ...customData
    };

    setMessages((prev) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newMessage]
    }));

    setInputText('');
    setShowEmojiPicker(false);

    simulatePartnerReply();
  };

  const simulatePartnerReply = () => {
    setTimeout(() => {
      setTypingUsers((prev) => ({ ...prev, [activeTab]: true }));
      setTimeout(() => {
        setTypingUsers((prev) => ({ ...prev, [activeTab]: false }));

        const replies = [
          'That looks awesome! Great work team ✨',
          'I checked the update, everything looks solid!',
          'Haha nice one! 😂',
          'Got it! Will keep you posted.',
          'Let me dive into that right away 👍'
        ];
        const randomText = replies[Math.floor(Math.random() * replies.length)];

        const botSender = !isChannel 
          ? INITIAL_USERS.find(u => u.id === activeTab) 
          : INITIAL_USERS[Math.floor(Math.random() * INITIAL_USERS.length)];

        if (!botSender) return;

        const autoMsg = {
          id: `msg_bot_${Date.now()}`,
          sender: botSender,
          text: randomText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: {},
          replies: []
        };

        setMessages((prev) => ({
          ...prev,
          [activeTab]: [...(prev[activeTab] || []), autoMsg]
        }));
      }, 2200);
    }, 800);
  };

  const handleAddReaction = (msgId, emoji) => {
    setMessages((prev) => {
      const roomMsgs = prev[activeTab] || [];
      const updated = roomMsgs.map((msg) => {
        if (msg.id === msgId) {
          const userList = msg.reactions[emoji] || [];
          const hasReacted = userList.includes(CURRENT_USER.id);
          const newUsers = hasReacted
            ? userList.filter(id => id !== CURRENT_USER.id)
            : [...userList, CURRENT_USER.id];

          const newReactions = { ...msg.reactions };
          if (newUsers.length > 0) {
            newReactions[emoji] = newUsers;
          } else {
            delete newReactions[emoji];
          }

          return { ...msg, reactions: newReactions };
        }
        return msg;
      });
      return { ...prev, [activeTab]: updated };
    });
  };

  const handleAddReply = (threadMsgId, replyText) => {
    if (!replyText.trim()) return;

    const newReply = {
      id: `rep_${Date.now()}`,
      sender: CURRENT_USER,
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => {
      const roomMsgs = prev[activeTab] || [];
      const updated = roomMsgs.map((msg) => {
        if (msg.id === threadMsgId) {
          return { ...msg, replies: [...(msg.replies || []), newReply] };
        }
        return msg;
      });
      return { ...prev, [activeTab]: updated };
    });

    if (activeThread && activeThread.id === threadMsgId) {
      setActiveThread((prev) => ({
        ...prev,
        replies: [...(prev.replies || []), newReply]
      }));
    }
    setThreadInput('');
  };

  const handleSendVoiceNote = () => {
    setIsRecording(false);
    handleSendMessage({
      text: '🎙️ Voice Message',
      audio: { duration: `${audioStreamTime || 5}s` }
    });
  };

  const handleSendMockImage = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800'
    ];
    const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    handleSendMessage({
      media: { type: 'image', url: randomImg }
    });
  };

  const togglePinMessage = (msg) => {
    if (pinnedMessages.some(m => m.id === msg.id)) {
      setPinnedMessages(pinnedMessages.filter(m => m.id !== msg.id));
    } else {
      setPinnedMessages([...pinnedMessages, msg]);
    }
  };

  const renderFormattedText = (text) => {
    if (!text) return null;

    if (text.includes('```')) {
      const parts = text.split('```');
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          const lines = part.trim().split('\n');
          const lang = lines[0].match(/^[a-z]+/i) ? lines[0] : 'code';
          const codeContent = lang !== 'code' ? lines.slice(1).join('\n') : part;
          return (
            <div key={index} className="my-2 p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto shadow-inner border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-bold mb-1 flex items-center justify-between">
                <span>{lang}</span>
                <Code className="w-3.5 h-3.5" />
              </div>
              <code>{codeContent}</code>
            </div>
          );
        }
        return <span key={index}>{renderMarkdownInline(part)}</span>;
      });
    }

    return renderMarkdownInline(text);
  };

  const renderMarkdownInline = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((chunk, i) => {
      if (chunk.startsWith('**') && chunk.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900 dark:text-slate-100">{chunk.slice(2, -2)}</strong>;
      }
      return chunk;
    });
  };

  const currentMessages = (messages[activeTab] || []).filter(msg => {
    if (!searchQuery) return true;
    return msg.text?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 overflow-hidden">
      
      {}
      <div className="w-16 md:w-20 bg-slate-900 flex flex-col items-center py-4 justify-between z-20 shrink-0 border-r border-slate-800">
        <div className="flex flex-col items-center space-y-6 w-full">
          {/* Logo */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 cursor-pointer transform hover:scale-105 transition-transform">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>

          <div className="w-8 h-[1px] bg-slate-800 rounded-full" />

          {/* Nav Icons */}
          <button className="p-3 text-indigo-400 bg-slate-800/80 rounded-2xl shadow-inner relative group">
            <MessageCircle className="w-5 h-5" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap shadow-md">
              Chats
            </span>
          </button>

          <button className="p-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-2xl transition-all relative group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap shadow-md">
              Notifications
            </span>
          </button>

          <button className="p-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-2xl transition-all relative group">
            <Sparkles className="w-5 h-5" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap shadow-md">
              AI Assistant
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4 w-full">
          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 text-slate-400 hover:text-yellow-400 hover:bg-slate-800 rounded-2xl transition-all relative group"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap shadow-md">
              Switch Theme
            </span>
          </button>

          {/* User Avatar */}
          <div 
            onClick={() => setShowProfileDrawer(!showProfileDrawer)}
            className="relative cursor-pointer group"
          >
            <img 
              src={CURRENT_USER.avatar} 
              alt={CURRENT_USER.name}
              className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover transform group-hover:scale-105 transition-transform" 
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
          </div>
        </div>
      </div>

      {}
      <div className="w-64 md:w-72 bg-white dark:bg-slate-900 flex flex-col border-r border-slate-200 dark:border-slate-800 shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100">PulseChat</h1>
            <span className="px-2 py-0.5 text-[10px] bg-indigo-500/10 text-indigo-500 font-semibold rounded-full border border-indigo-500/20">
              v2.4
            </span>
          </div>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-6 custom-scrollbar">
          {/* Channels */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2 px-2">
              <span>Channels</span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">{INITIAL_ROOMS.length}</span>
            </div>
            <div className="space-y-1">
              {INITIAL_ROOMS.map((room) => {
                const isActive = activeTab === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => setActiveTab(room.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/20' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Hash className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{room.name}</span>
                    </div>
                    {room.unread > 0 && !isActive && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-pink-500 text-white rounded-full">
                        {room.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2 px-2">
              <span>Direct Messages</span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">{INITIAL_USERS.length}</span>
            </div>
            <div className="space-y-1">
              {INITIAL_USERS.map((usr) => {
                const isActive = activeTab === usr.id;
                return (
                  <button
                    key={usr.id}
                    onClick={() => setActiveTab(usr.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/20' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img src={usr.avatar} alt={usr.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white dark:border-slate-900 ${
                        usr.status === 'online' ? 'bg-green-500' : usr.status === 'idle' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                    </div>
                    <div className="flex flex-col items-start truncate text-left">
                      <span className="truncate font-medium leading-tight">{usr.name}</span>
                      <span className={`text-[11px] truncate ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {usr.statusMsg}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current User Bar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{CURRENT_USER.name}</span>
              <span className="text-[10px] text-green-500 font-medium flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>Online</span>
              </span>
            </div>
          </div>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 min-w-0 relative">
        
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            {isChannel ? (
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                <Hash className="w-5 h-5" />
              </div>
            ) : (
              <div className="relative">
                <img src={currentTarget?.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                  currentTarget?.status === 'online' ? 'bg-green-500' : 'bg-slate-400'
                }`} />
              </div>
            )}
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <span>{isChannel ? (currentTarget?.name) : currentTarget?.name}</span>
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-md">
                {isChannel ? currentTarget?.description : currentTarget?.statusMsg}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isChannel && (
              <>
                <button className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <Video className="w-4 h-4" />
                </button>
              </>
            )}
            <button 
              onClick={() => setShowProfileDrawer(!showProfileDrawer)}
              className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pinned Announcement Banner if any */}
        {pinnedMessages.length > 0 && (
          <div className="bg-indigo-500/10 dark:bg-indigo-950/40 border-b border-indigo-500/20 px-6 py-2 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-300">
            <div className="flex items-center space-x-2 truncate">
              <Pin className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold">Pinned:</span>
              <span className="truncate">{pinnedMessages[pinnedMessages.length - 1]?.text}</span>
            </div>
            <button 
              onClick={() => setPinnedMessages([])}
              className="text-[10px] underline hover:text-indigo-400 shrink-0 ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Messages Scroll Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-200 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                <MessageSquare className="w-8 h-8" />
              </div>
              <p className="font-medium text-sm">No messages here yet!</p>
              <p className="text-xs max-w-xs text-slate-400">
                Start the conversation by sending a message or dropping a greeting down below.
              </p>
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isMe = msg.sender.id === CURRENT_USER.id;
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start space-x-3 group ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <img 
                    src={msg.sender.avatar} 
                    alt={msg.sender.name} 
                    className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5" 
                  />

                  <div className={`flex flex-col max-w-xl ${isMe ? 'items-end' : 'items-start'}`}>
                    {/* Header info */}
                    <div className="flex items-center space-x-2 mb-1 px-1">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {msg.sender.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.time}</span>
                    </div>

                    {/* Message Bubble Container */}
                    <div className="relative group/bubble">
                      <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                        isMe 
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none' 
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                      }`}>
                        {/* Text Content */}
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {renderFormattedText(msg.text)}
                        </div>

                        {/* Image Attachment if any */}
                        {msg.media && msg.media.type === 'image' && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
                            <img src={msg.media.url} alt="Attachment" className="max-h-64 w-full object-cover" />
                          </div>
                        )}

                        {/* Audio Voice Note if any */}
                        {msg.audio && (
                          <div className="mt-2 flex items-center space-x-3 bg-indigo-900/20 dark:bg-slate-800/80 p-2.5 rounded-xl border border-indigo-500/20">
                            <button 
                              onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                              className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow"
                            >
                              {playingAudioId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <div className="flex-1 space-y-1">
                              <div className="h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className={`h-full bg-indigo-500 transition-all ${playingAudioId === msg.id ? 'w-3/4 animate-pulse' : 'w-1/4'}`} />
                              </div>
                              <div className="flex justify-between text-[10px] opacity-75">
                                <span>Audio Voice Note</span>
                                <span>{msg.audio.duration}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Action Hover Bar */}
                      <div className={`absolute top-0 -translate-y-1/2 flex items-center space-x-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-md opacity-0 group-hover/bubble:opacity-100 transition-opacity z-20 ${
                        isMe ? 'right-0' : 'left-0'
                      }`}>
                        {EMOJI_LIST.slice(0, 4).map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleAddReaction(msg.id, emoji)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-xs transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                        <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-700 mx-1" />
                        <button 
                          onClick={() => setActiveThread(msg)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                          title="Reply in thread"
                        >
                          <CornerUpLeft className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => togglePinMessage(msg)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                          title="Pin message"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Reactions Display */}
                    {Object.keys(msg.reactions || {}).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {Object.entries(msg.reactions).map(([emoji, users]) => {
                          const hasReacted = users.includes(CURRENT_USER.id);
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleAddReaction(msg.id, emoji)}
                              className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs border transition-all ${
                                hasReacted 
                                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 font-medium' 
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span className="text-[10px]">{users.length}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Thread Replies Indicator */}
                    {msg.replies && msg.replies.length > 0 && (
                      <button 
                        onClick={() => setActiveThread(msg)}
                        className="flex items-center space-x-1.5 text-xs text-indigo-500 font-semibold mt-1.5 hover:underline"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{msg.replies.length} {msg.replies.length === 1 ? 'reply' : 'replies'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {typingUsers[activeTab] && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs italic animate-pulse py-2">
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Someone is typing...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 relative">
          
          {/* Emoji Picker Popover */}
          {showEmojiPicker && (
            <div className="absolute bottom-20 left-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xl flex items-center gap-2 z-50">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setInputText((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="hover:scale-125 transition-transform text-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Recording Mode Header Bar */}
          {isRecording ? (
            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-2xl p-3 text-red-500 text-xs font-semibold animate-pulse">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                <span>Recording Audio... ({audioStreamTime}s)</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsRecording(false)} 
                  className="p-1 hover:bg-red-500/20 rounded-lg text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleSendVoiceNote} 
                  className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-2 border border-slate-200 dark:border-slate-700/50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors"
              >
                <Smile className="w-5 h-5" />
              </button>

              <button 
                onClick={handleSendMockImage}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors"
                title="Attach Image"
              >
                <Image className="w-5 h-5" />
              </button>

              <input 
                type="text" 
                placeholder={isChannel ? `Message #${currentTarget?.name}` : `Message ${currentTarget?.name}`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 outline-none px-2 placeholder-slate-400"
              />

              <button 
                onClick={() => setIsRecording(true)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors"
                title="Record Voice Note"
              >
                <Mic className="w-5 h-5" />
              </button>

              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className={`p-2.5 rounded-xl transition-all ${
                  inputText.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/30' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {}
      {activeThread && (
        <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col z-20 shrink-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Thread Reply</h3>
            </div>
            <button 
              onClick={() => setActiveThread(null)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Thread Parent Message */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2.5 mb-2">
              <img src={activeThread.sender.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{activeThread.sender.name}</span>
                <span className="text-[10px] text-slate-400 ml-2">{activeThread.time}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">{activeThread.text}</p>
          </div>

          {/* Thread Replies Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {activeThread.replies && activeThread.replies.length > 0 ? (
              activeThread.replies.map((reply) => (
                <div key={reply.id} className="flex items-start space-x-2.5">
                  <img src={reply.sender.avatar} alt="" className="w-6 h-6 rounded-full object-cover mt-0.5" />
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{reply.sender.name}</span>
                      <span className="text-[9px] text-slate-400">{reply.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{reply.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 text-xs py-8">
                No replies in this thread yet. Be the first to respond!
              </div>
            )}
          </div>

          {/* Thread Input */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Reply to thread..."
              value={threadInput}
              onChange={(e) => setThreadInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddReply(activeThread.id, threadInput)}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl outline-none"
            />
            <button 
              onClick={() => handleAddReply(activeThread.id, threadInput)}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {}
      {showProfileDrawer && (
        <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center z-20 shrink-0 space-y-6">
          <div className="w-full flex justify-end">
            <button 
              onClick={() => setShowProfileDrawer(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <img 
              src={currentTarget?.avatar || CURRENT_USER.avatar} 
              alt="" 
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500/20 shadow-lg" 
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          <div className="text-center">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
              {currentTarget?.name || CURRENT_USER.name}
            </h3>
            <p className="text-xs text-indigo-500 font-medium">
              {currentTarget?.username || CURRENT_USER.username}
            </p>
            <p className="text-xs text-slate-400 mt-2 italic px-4">
              "{currentTarget?.statusMsg || CURRENT_USER.statusMsg}"
            </p>
          </div>

          <div className="w-full border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Local Time</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">11:24 AM</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Role</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Product Designer</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Joined</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Jan 2024</span>
            </div>
          </div>

          <button className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors">
            View Full Profile
          </button>
        </div>
      )}

    </div>
  );
}