import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface ContactForm {
  title: string;
  email: string;
  phone: string;
  description: string;
  attachment: File | null;
}

interface Message {
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
}

const UserPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [purchasedProjects, setPurchasedProjects] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);
  const [showEmailContent, setShowEmailContent] = useState(false);
  const [contactForm, setContactForm] = useState<ContactForm>({
    title: '',
    email: '',
    phone: '',
    description: '',
    attachment: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('purchased_projects, cart, wishlist')
          .eq('id', user.id)
          .single();

        if (data) {
          setPurchasedProjects(data.purchased_projects || []);
          setCartItems(data.cart || []);
          setWishlistItems(data.wishlist || []);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const fetchMessages = async () => {
    if (!user) return;
    
    setLoadingMessages(true);
    setMessages([]);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('messages')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data?.messages) {
        try {
          setMessages(JSON.parse(data.messages));
        } catch (error) {
          console.error('Error parsing messages:', error);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) return;

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('messages')
        .eq('id', user.id)
        .single();
      
      const existingMessages = userData?.messages ? JSON.parse(userData.messages) : [];
      const newMessage = {
        from: user.email || '',
        to: 'admin',
        subject: contactForm.title,
        body: contactForm.description,
        timestamp: new Date().toISOString()
      };

      await supabase
        .from('users')
        .update({ messages: JSON.stringify([...existingMessages, newMessage]) })
        .eq('id', user.id);
      
      setContactForm({
        title: '',
        email: '',
        phone: '',
        description: '',
        attachment: null
      });
      
      fetchMessages();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-blue-900 text-white p-4">
          <nav className="space-y-2">
            <button
              className="flex items-center space-x-2 py-2 px-4 bg-blue-800 rounded-md w-full text-left"
              onClick={() => {
                setShowEmailContent(!showEmailContent);
                setShowPurchaseHistory(false);
              }}
            >
              <i className="fas fa-envelope"></i>
              <span>Email</span>
            </button>
            <a className="flex items-center space-x-2 py-2 px-4 bg-blue-800 rounded-md" href="#">
              <i className="fas fa-comments"></i>
              <span>Chat</span>
            </a>
            <a className="flex items-center space-x-2 py-2 px-4 bg-blue-800 rounded-md" href="#">
              <i className="fas fa-user"></i>
              <span>User</span>
            </a>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between bg-blue-300 p-4 shadow-md">
            <div className="flex items-center space-x-4">
              <i className="fas fa-bars text-white md:hidden"></i>
              <div className="relative">
                <input 
                  className="bg-gray-200 rounded-full pl-10 pr-4 py-2 focus:outline-none" 
                  placeholder="Search..." 
                  type="text" 
                />
                <i className="fas fa-search absolute left-3 top-2.5 text-gray-600"></i>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <i className="fas fa-bell text-white"></i>
              <i className="fas fa-cog text-white"></i>
              <div className="flex items-center space-x-2">
                <img 
                  alt="User avatar" 
                  className="w-10 h-10 rounded-full" 
                  src="/api/placeholder/40/40"
                  width="40" 
                  height="40" 
                />
                <div>
                  <div className="text-black font-semibold">{user?.email}</div>
                  <div className="text-xs text-gray-500">Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-4">
            {showEmailContent ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <button 
                  className="bg-blue-700 text-white p-2 rounded hover:bg-blue-800"
                  onClick={() => {
                    fetchMessages();
                    setShowEmailContent(true);
                    setShowPurchaseHistory(false);
                  }}
                >
                  Messages
                </button>
                {loadingMessages ? (
                  <p>Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p>No messages found.</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className="p-4 bg-gray-100 rounded-lg">
                        <div className="flex justify-between">
                          <div className="font-semibold">{message.subject}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(message.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">{message.body}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          From: {message.from} | To: {message.to}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <h2 className="text-2xl font-bold mb-4 mt-6">Contact Admin</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={contactForm.title}
                    onChange={(e) => setContactForm({...contactForm, title: e.target.value})}
                    className="border p-2 w-full rounded"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="border p-2 w-full rounded"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    className="border p-2 w-full rounded"
                  />
                  <textarea
                    placeholder="Description of the problem"
                    value={contactForm.description}
                    onChange={(e) => setContactForm({...contactForm, description: e.target.value})}
                    className="border p-2 w-full rounded"
                    rows={4}
                  />
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setContactForm({...contactForm, attachment: e.target.files[0]});
                      }
                    }}
                    className="border p-2 w-full rounded"
                  />
                  <p>Make an attachment as zip and upload</p>
                  <button
                    type="submit"
                    className="bg-blue-700 text-white p-2 rounded hover:bg-blue-800 w-full"
                  >
                    Send
                  </button>
                </form>
              </div>
            ) : showPurchaseHistory ? (
              loading ? (
                <p>Loading purchase history...</p>
              ) : (
                purchasedProjects.length > 0 ? (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Purchase History</h2>
                    <ul>
                      {purchasedProjects.map((project, index) => (
                        <li key={index} className="mb-2 p-2 bg-white rounded shadow">
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No purchases found.</p>
                )
              )
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">Cart Items</h2>
                {loading ? (
                  <p>Loading cart items...</p>
                ) : cartItems.length > 0 ? (
                  <ul>
                    {cartItems.map((item, index) => (
                      <li key={index} className="mb-2 p-2 bg-white rounded shadow">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No items in cart.</p>
                )}

                <h2 className="text-xl font-bold mb-4 mt-6">Wishlist Items</h2>
                {loading ? (
                  <p>Loading wishlist items...</p>
                ) : wishlistItems.length > 0 ? (
                  <ul>
                    {wishlistItems.map((item, index) => (
                      <li key={index} className="mb-2 p-2 bg-white rounded shadow">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No items in wishlist.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;