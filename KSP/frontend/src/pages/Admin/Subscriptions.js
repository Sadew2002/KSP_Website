import React, { useState } from 'react';
import { Mail, Send, Loader2, Users, ChevronDown } from 'lucide-react';
import { subscriberBroadcastService, subscriberListService } from '../../services/apiService';

const Subscriptions = () => {
  const [form, setForm] = useState({
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [subscribers, setSubscribers] = useState([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [showSubscribers, setShowSubscribers] = useState(false);

  const fetchSubscribers = async () => {
    try {
      setLoadingSubscribers(true);
      setError('');

      const response = await subscriberListService.getSubscribers();
      const list = response.data?.data || [];
      setSubscribers(list);
      setShowSubscribers(true);
      setSuccess(response.data?.message || 'Subscribers loaded successfully.');
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Failed to load subscribers.'
      );
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess('');
    setError('');

    if (!form.subject.trim() || !form.message.trim()) {
      setError('Subject and message are required.');
      return;
    }

    try {
      setSending(true);
      const response = await subscriberBroadcastService.sendBroadcast({
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setSuccess(response.data?.message || 'Message sent to subscribers.');
      setForm({ subject: '', message: '' });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Failed to send subscriber email.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-ksp-red/10 flex items-center justify-center">
            <Mail size={22} className="text-ksp-red" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Subscriptions</h2>
            <p className="text-sm text-gray-500">
              Send a Gmail SMTP broadcast to all active subscribers
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={fetchSubscribers}
            disabled={loadingSubscribers}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingSubscribers ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Users size={18} />
                Show Subscribers
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowSubscribers((previous) => !previous)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            <ChevronDown size={18} className={showSubscribers ? 'rotate-180 transition-transform' : 'transition-transform'} />
            {showSubscribers ? 'Hide List' : 'Toggle List'}
          </button>
        </div>

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {showSubscribers && (
          <div className="mb-6 border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Subscriber List</h3>
              <span className="text-sm text-gray-500">{subscribers.length} active subscribers</span>
            </div>

            {subscribers.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                No subscribers loaded yet. Click <span className="font-semibold">Show Subscribers</span> to fetch them from the backend.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscribed</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{subscriber.user?.name || 'Unnamed User'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{subscriber.user?.email || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{subscriber.user?.phone || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {subscriber.subscriptionDate ? new Date(subscriber.subscriptionDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                            {subscriber.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Enter email subject"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={10}
              placeholder="Write the message to send to subscribers..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red resize-none"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              Emails are sent in backend batches to reduce Gmail SMTP limits.
            </p>

            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-6 py-3 bg-ksp-red text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Subscriptions;