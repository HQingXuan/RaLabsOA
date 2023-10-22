const blogService = require("../services/BlogService");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getAllBlogs();
    res.json({ data: blogs, status: "success" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createBlog = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.title || !req.body.status) {
      return res.status(400).json({ error: "Title, description, and status are required." });
    }

    // Validate status
    const validStatuses = ["TODO", "IN_PROGRESS", "COMPLETED"];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const blog = await blogService.createBlog(req.body);
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    // Validate blog ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid blog ID format." });
    }

    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    // Validate blog ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid blog ID format." });
    }

    // Validate request body
    if (!req.body.title || !req.body.status) {
      return res.status(400).json({ error: "Title and status are required." });
    }

    // Validate status
    const validStatuses = ["TODO", "IN_PROGRESS", "COMPLETED"];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const blog = await blogService.updateBlog(req.params.id, req.body);

    // Check for validation errors explicitly and return 400 status code
    const validationErrors = blog.validateSync(); // Check for validation errors
    if (validationErrors) {
      return res.status(700).json({ error: "Validation failed.", validationErrors });
    }

    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    res.json({ data: blog, status: "success" }); // Return 200 status code for successful update
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.deleteBlog = async (req, res) => {
  try {
    // Validate blog ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid blog ID format." });
    }

    const blog = await blogService.deleteBlog(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

