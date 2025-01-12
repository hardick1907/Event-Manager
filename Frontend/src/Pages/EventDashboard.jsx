import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEventStore } from '../store/useEventStore';
import { useAuthStore } from '../store/useAuthStore';

function EventDashboard() {
  const { events, getAllEvents, isLoading } = useEventStore();
  const { authUser } = useAuthStore();

  const [createdEvents, setCreatedEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  useEffect(() => {
    if (events.length > 0 && authUser) {
      const userCreatedEvents = events.filter(
        (event) => event.creator._id === authUser._id
      );

      const userAttendingEvents = events.filter((event) =>
        event.attendees.includes(authUser.id)
      );

      setCreatedEvents(userCreatedEvents);
      setAttendingEvents(userAttendingEvents);
    }
  }, [events, authUser]);

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Events You're Hosting
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {createdEvents.length > 0 ? (
            createdEvents.map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-5 w-5 mr-2" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-5 w-5 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users className="h-5 w-5 mr-2" />
                      {event.attendees.length} / {event.capacity} attendees
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>You are not hosting any events.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Events You're Attending
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendingEvents.length > 0 ? (
            attendingEvents.map((event) => (
              <Link
                key={event._id}
                to={`/event/${event._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-5 w-5 mr-2" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-5 w-5 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users className="h-5 w-5 mr-2" />
                      {event.attendees.length} / {event.capacity} attendees
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>You are not attending any events.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDashboard;
