const Blog = require("../models/Blog");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
chai.should();

chai.use(chaiHttp);

describe("Blogs", () => {
    beforeEach((done) => {
        Blog.deleteMany({})
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });
    });
  describe("/GET blog", () => {
    it("it should GET all the blogs", (done) => {
      chai
        .request(app)
        .get("/api/blogs")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(0);
          done();
        });
    });
  });
  describe("/POST blog", () => {
    it("it should new POST a blog", (done) => {
      let blog = {
        title: "This is the first blog",
        description: "This is a blog post",
        status: "TODO" 
      };
      chai
        .request(app)
        .post("/api/blogs")
        .send(blog)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("object");
          res.body.status.should.be.eql("success");
          done();
        });
    });
  });
  describe("/GET/:id blog", () => {
    it("it should GET a blog by the id", async () => {
        let blog = new Blog({
            title: "This is the first blog",
            description: "This is a blog post",
            status: "TODO"
        });

        await blog.save();

        try {
            let response = await chai.request(app).get("/api/blogs/" + blog.id);
            response.should.have.status(200);
            response.body.should.be.a("object");
            response.body.status.should.be.eql("success");
            response.body.data.should.have.property("title").eql(blog.title);
            response.body.data.should.have.property("description").eql(blog.description);
            response.body.data.should.have.property("status").eql(blog.status);
        } catch (error) {
            throw error;
        }
    });
});

describe("/PUT/:id blog", () => {
  it("it should UPDATE a blog given the id", async () => {
      let blog = new Blog({
          title: "This is the first blog",
          description: "This is a blog post",
          status: "TODO"
      });

      await blog.save();
      

      try {
          let updatedData = {
              title: "Updated Blog Title",
              description: "Updated Blog Description",
              status: "IN_PROGRESS"
          };

          let response = await chai.request(app)
              .put("/api/blogs/" + blog.id)
              .send(updatedData);

          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.status.should.be.eql("success");
          response.body.data.should.have.property("title").eql(updatedData.title);
          response.body.data.should.have.property("description").eql(updatedData.description);
          response.body.data.should.have.property("status").eql(updatedData.status);
      } catch (error) {
          throw error;
      }
  });
});

describe("/DELETE/:id blog", () => {
    it("it should DELETE a blog given the id", async () => {
        let blog = new Blog({
            title: "This is the first blog",
            body: "This is a blog post",
            status: "TODO"
        });

        await blog.save();

        try {
            let response = await chai.request(app).delete("/api/blogs/" + blog.id);
            response.should.have.status(200);
            response.body.data.should.be.a("object");
            response.body.status.should.be.eql("success");
        } catch (error) {
            throw error;
        }
    });
  });

  describe("/POST blog", () => {
  it("it should not POST a blog without required fields", (done) => {
    let blog = {}; // Empty blog object
    chai
      .request(app)
      .post("/api/blogs")
      .send(blog)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("error");
        done();
      });
  });

  it("it should not POST a blog with invalid status", (done) => {
    let blog = {
      title: "Invalid Status Blog",
      description: "This blog has an invalid status",
      status: "INVALID_STATUS",
    };
    chai
      .request(app)
      .post("/api/blogs")
      .send(blog)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("error");
        done();
      });
  });
});

describe("/GET/:id blog", () => {
  it("it should not GET a blog with invalid id", async () => {
    try {
      let response = await chai.request(app).get("/api/blogs/invalidId");
      response.should.have.status(400);
      response.body.should.have.property("error");
    } catch (error) {
      throw error;
    }
  });
});

describe("/PUT/:id blog", () => {
  it("it should not UPDATE a blog with invalid id", async () => {
    try {
      let response = await chai
        .request(app)
        .put("/api/blogs/invalidId")
        .send({
          title: "Updated Blog",
          description: "This is an updated blog",
          status: "TODO",
        });
      response.should.have.status(400);
      response.body.should.have.property("error");
    } catch (error) {
      throw error;
    }
  });

  it("it should not UPDATE a blog with invalid data", async () => {
    let blog = new Blog({
      title: "Original Blog",
      description: "This is the original blog",
      status: "TODO",
    });
    await blog.save();

    try {
      let response = await chai
        .request(app)
        .put("/api/blogs/" + blog.id)
        .send({
          status: "INVALID_STATUS", // Invalid status value
        });
      response.should.have.status(400);
      response.body.should.have.property("error");
    } catch (error) {
      throw error;
    }
  });
});

describe("/DELETE/:id blog", () => {
  it("it should not DELETE a blog with invalid id", async () => {
    try {
      let response = await chai.request(app).delete("/api/blogs/invalidId");
      response.should.have.status(400);
      response.body.should.have.property("error");
    } catch (error) {
      throw error;
    }
  });
});


describe("Basic Integration Test", () => {
  beforeEach((done) => {
    Blog.deleteMany({})
    .then(() => {
        done();
    })
    .catch((err) => {
        done(err);
    });
  });

  it("should perform CRUD operations on blogs", async () => {
    // POST a new blog
    const newBlog = {
      title: "Test Blog",
      description: "This is a test blog",
      status: "TODO"
    };
    const postResponse = await chai
      .request(app)
      .post("/api/blogs")
      .send(newBlog);
    postResponse.should.have.status(200);
    postResponse.body.should.be.a("object");
    postResponse.body.status.should.be.eql("success");

    // GET all blogs
    const getResponse = await chai.request(app).get("/api/blogs");
    getResponse.should.have.status(200);
    getResponse.body.data.should.be.a("array");
    getResponse.body.data.length.should.be.eql(1);

    // GET the created blog by ID
    const createdBlogId = getResponse.body.data[0]._id;
    const getByIdResponse = await chai.request(app).get(`/api/blogs/${createdBlogId}`);
    getByIdResponse.should.have.status(200);
    getByIdResponse.body.data.should.be.a("object");
    getByIdResponse.body.status.should.be.eql("success");

    // UPDATE the created blog
    const updatedBlog = {
      title: "Updated Test Blog",
      description: "This is an updated test blog",
      status: "IN_PROGRESS"
    };
    const updateResponse = await chai
      .request(app)
      .put(`/api/blogs/${createdBlogId}`)
      .send(updatedBlog);
    updateResponse.should.have.status(200);
    updateResponse.body.data.should.be.a("object");
    updateResponse.body.status.should.be.eql("success");

    // DELETE the created blog
    const deleteResponse = await chai.request(app).delete(`/api/blogs/${createdBlogId}`);
    deleteResponse.should.have.status(200);
    deleteResponse.body.data.should.be.a("object");
    deleteResponse.body.status.should.be.eql("success");

    // GET the deleted blog by ID (should return 404)
    const getDeletedResponse = await chai.request(app).get(`/api/blogs/${createdBlogId}`);
    getDeletedResponse.should.have.status(404);
  });
});

describe("Basic Integration Test 2", () => {
  beforeEach((done) => {
    Blog.deleteMany({})
    .then(() => {
        done();
    })
    .catch((err) => {
        done(err);
    });
  });

  it("should perform CRUD operations on blogs", async () => {
    // POST a new blog
    const newBlog = {
      title: "Test Blog",
      description: "This is a test blog",
      status: "TODO"
    };
    const postResponse = await chai
      .request(app)
      .post("/api/blogs")
      .send(newBlog);
    postResponse.should.have.status(200);
    postResponse.body.should.be.a("object");
    postResponse.body.status.should.be.eql("success");
    const createdBlog = postResponse.body.data;
    console.log(createdBlog._id);

    // GET all blogs and check if the created blog is present
    const getResponse = await chai.request(app).get("/api/blogs");
    getResponse.should.have.status(200);
    getResponse.body.data.should.be.a("array");
    getResponse.body.data.length.should.be.eql(1);
    const retrievedBlogs = getResponse.body.data;
    const retrievedBlog = retrievedBlogs[0];
    retrievedBlog.title.should.be.eql(newBlog.title);
    retrievedBlog.description.should.be.eql(newBlog.description);

    // GET the created blog by ID and check if the data matches
    const getByIdResponse = await chai.request(app).get(`/api/blogs/${createdBlog._id}`);
    getByIdResponse.should.have.status(200);
    getByIdResponse.body.data.should.be.a("object");
    getByIdResponse.body.status.should.be.eql("success");
    getByIdResponse.body.data.title.should.be.eql(newBlog.title);
    getByIdResponse.body.data.description.should.be.eql(newBlog.description);

    // UPDATE the created blog and check if the data is updated
    const updatedBlog = {
      title: "Updated Test Blog",
      description: "This is an updated test blog",
      status: "IN_PROGRESS"
    };
    const updateResponse = await chai
      .request(app)
      .put(`/api/blogs/${createdBlog._id}`)
      .send(updatedBlog);
    updateResponse.should.have.status(200);
    updateResponse.body.data.should.be.a("object");
    updateResponse.body.status.should.be.eql("success");
    console.log(updateResponse.body.data.title)
    

    // DELETE the created blog and check if it's deleted
    const deleteResponse = await chai.request(app).delete(`/api/blogs/${createdBlog._id}`);
    deleteResponse.should.have.status(200);
    deleteResponse.body.data.should.be.a("object");
    deleteResponse.body.status.should.be.eql("success");

    // GET the deleted blog by ID (should return 404)
    const getDeletedResponse = await chai.request(app).get(`/api/blogs/${createdBlog._id}`);
    getDeletedResponse.should.have.status(404);
  });
});


});

