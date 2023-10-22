const UserService = require("../services/UserService");
const BlogService = require("../services/BlogService");

exports.getAllUsers = async (req, res) => {
  try {
    const blogs = await UserService.getAllUsers();
    res.json({ data: blogs, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const blog = await UserService.createUser(req.body);
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const blog = await UserService.getUserById(req.params.id);
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const blog = await UserService.updateUser(req.params.id, req.body);
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(600).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const blog = await UserService.deleteUser(req.params.id);
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.mergeAllEvents = async (req, res) => {
    try {
      const userId = req.params.id; // Get user ID from request params
      const user = await UserService.getUserById(userId); // Fetch user by ID
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      let events = [];
      // Fetch all blog instances based on their IDs
      for (let i = 0; i < user.events.length; i++) {
        single_event = await BlogService.getBlogById(user.events[i]);
        if (!single_event) {
            return res.status(404).json({ error: "event not found." });
          }
        events.push(single_event);
      }  
      // Sort events by start time
      events.sort((a, b) => a.startTime - b.startTime);
      console.log(events);

      user.events = events;
  
      const mergedEvents = [];
      const mergedInvitees = [];
      let currentEvent = events[0];
      
  
      // Loop through sorted events and merge overlapping ones
      for (let i = 1; i < events.length; i++) {
        const nextEvent = events[i];
  
        // If the next event overlaps with the current event, merge them
        if (nextEvent.startTime <= currentEvent.endTime) {
          currentEvent.endTime = Math.max(currentEvent.endTime, nextEvent.endTime);
          currentEvent.title = currentEvent.title + "," +nextEvent.title;
          currentEvent.invitees = currentEvent.invitees + "," + nextEvent.invitees;
          id = currentEvent.id;
          await BlogService.updateBlog(id, currentEvent);

          update_event = await BlogService.getBlogById(id);
          console.log(update_event)

          mergedEvents.push(currentEvent.id);
          currentEvent = nextEvent;

        } else {
          // If no overlap, update currentEvent
          mergedEvents.push(currentEvent.id);
          currentEvent = nextEvent;

        }
      }

      user.events = mergedEvents;

      await UserService.updateUser(user.id, user)

      const user2 = await UserService.getUserById(userId);
      console.log(user2);
  
      res.json({ data: user, status: 'success' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
