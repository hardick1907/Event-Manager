import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEventStore } from '../store/useEventStore';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect, useState } from 'react';
import { Calendar, Loader, MapPin, User, Users } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, joinEvent, leaveEvent, isLoading,deleteEvent} = useEventStore();
  const { authUser, socket } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        if (data) {
          setEvent(data);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        setError(err.message || 'Error fetching event details');
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, getEventById]);

  useEffect(() => {
    if (!socket || !event) return;
    socket.on(`event:${id}:memberUpdate`, (updatedEvent) => {
      setEvent(prev => ({
        ...prev,
        attendees: updatedEvent.attendees
      }));
    });

    return () => {
      socket.off(`event:${id}:memberUpdate`);
    };
  }, [socket, id, event]);

  const handleJoinEvent = async () => {
    try {
      await joinEvent(id);
      const updatedEvent = await getEventById(id);
      setEvent(updatedEvent);
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };
  
  const handleLeaveEvent = async () => {
    try {
      await leaveEvent(id);
      const updatedEvent = await getEventById(id);
      setEvent(updatedEvent);
    } catch (error) {
      console.error('Error leaving event:', error);
    }
  };
  
  const isAttending = event?.attendees?.some(
    attendee => attendee._id === authUser?._id
  );

  const isEventFull = event?.attendees?.length >= event?.capacity;

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(id);
      navigate("/dashboard");
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-10 h-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-lg">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-64 object-cover rounded-lg shadow-lg mb-8"
        />
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              {new Date(event.date).toLocaleString()}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              {event.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              {event.attendees.length} / {event.capacity} attendees
            </div>
            <div className="flex items-center text-gray-600">
              <User className="h-5 w-5 mr-2" />
              Hosted by {event.creator.name}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            <p className="text-gray-600">{event.description}</p>
          </div>
        </div>

        {authUser && authUser._id !== event.creator._id && (
          <div className="mt-6">
            {!isAttending ? (
              <button
                onClick={handleJoinEvent}
                disabled={isEventFull}
                className={`btn btn-primary${
                  isEventFull
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'btn btn-primary'
                }`}
              >
                {isEventFull ? 'Event Full' : 'Join Event'}
              </button>
            ) : (
              <button
                onClick={handleLeaveEvent}
                className="btn btn-accent"
              >
                Leave Event
              </button>
            )}
          </div>
        )}
        <div className='flex justify-end gap-3'>
          {authUser && authUser._id === event.creator._id && (
            <>
            <button>
              <Link to={`/updateevent/${event._id}`} className="btn btn-warning">Update Event</Link>
            </button>
            <button className="btn btn-error" onClick={handleDeleteEvent}>
              Delete Event
            </button>
            </>

          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;