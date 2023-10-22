const User = require("../models/User");
const Blog = require("../models/Blog");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const BlogService = require('../services/BlogService');
const UserService = require('../services/UserService');
chai.should();
chai.use(chaiHttp);

describe("Users", () => {
    beforeEach((done) => {
        User.deleteMany({})
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });
    });

    describe("/GET users", () => {
        it("it should GET all the users", (done) => {
            chai
            .request(app)
            .get("/api/users")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a("array");
                res.body.data.length.should.be.eql(0);
                done();
            });
        });
    });
    
    describe("/POST user", () => {
        it("it should POST a user", (done) => {
            let user = {
                name: "Haoqing",
            };
            chai
            .request(app)
            .post("/api/users")
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a("object");
                res.body.data.should.have.property("name").eql("Haoqing"); // Validate user name
                res.body.status.should.be.eql("success");
                done();
            });
        });
    });
    
    describe("/GET/:id user", () => {
        it("it should GET a user by the id", async () => {
            let user = new User({
                name: "Haoqing",
            });
    
            await user.save();
    
            try {
                let response = await chai.request(app).get("/api/users/" + user.id);
                response.should.have.status(200);
                response.body.data.should.be.a("object");
                response.body.data.should.have.property("name").eql("Haoqing");
                response.body.status.should.be.eql("success");
            } catch (error) {
                throw error;
            }
        });
    });


describe("/PUT/:id user", () => {
    it("it should UPDATE a user given the id", async () => {
        // Create a new user
        let user = new User({
            name: "Haoqing",
            events: ["Event 1", "Event 2"]
        });

        await user.save();

        try {
            // Updated user data
            let updatedData = {
                name: "Haoqing Xuan",
                events: ["Updated Event 1", "Updated Event 2"]
            };

            // Make a PUT request to update the user
            let response = await chai.request(app)
                .put("/api/users/" + user.id)
                .send(updatedData);

            // Validations
            response.should.have.status(200);
            response.body.should.be.a("object");
            response.body.status.should.be.eql("success");
            response.body.data.should.have.property("name").eql(updatedData.name);
            response.body.data.should.have.property("events").eql(updatedData.events);
        } catch (error) {
            throw error;
        }
    });
});

    describe("/DELETE/:id user", () => {
        it("it should DELETE a user given the id", async () => {
            let user = new User({
                name: "Haoqing",
            });

            await user.save();

            try {
                let response = await chai.request(app).delete("/api/users/" + user.id);
                response.should.have.status(200);
                response.body.data.should.be.a("object");
                response.body.status.should.be.eql("success");
            } catch (error) {
                throw error;
            }
        });
    });

    describe('User Controller - mergeAllEvents', () => {
        it('should merge overlapping events for a user', async () => {
          // Create a few events with overlapping time
          const event1 = await BlogService.createBlog({
            title: 'Event 1',
            status: "TODO",
            startTime: new Date('2023-11-01T11:30:00Z'),
            endTime: new Date('2023-11-01T13:00:00Z'),
          });
          const event2 = await BlogService.createBlog({
            title: 'Event 2',
            status: "TODO",
            startTime: new Date('2023-11-01T10:00:00Z'),
            endTime: new Date('2023-11-01T12:00:00Z'),
          });
      
          // Create a user with these events
          const user = await UserService.createUser({
            name: 'Haoqing',
            events: [event1._id, event2._id],
          });
      
          // Call the mergeAllEvents endpoint
          const response = await chai.request(app).put(`/api/users/${user._id}/mergeAllEvents`);
          response.should.have.status(200);
          response.body.should.have.property('data');
          response.body.should.have.property('status').eql('success');
      
          // Get the merged events
          const mergedEvents = response.body.data.events;
      
          // Fetch events from the database based on their IDs
          const mergedEvent1 = await BlogService.getBlogById(mergedEvents[0]);      
          // Assertions to check if events were merged correctly
          mergedEvents.should.be.an('array').with.lengthOf(1);
          mergedEvent1.should.have.property("startTime").eql(event2.startTime);
          mergedEvent1.should.have.property("endTime").eql(event1.endTime);
        });
      });

      describe('User Controller - mergeAllEvents', () => {
        it('should merge overlapping events and keep un-overlapped events for a user', async () => {
          // Create events with overlapping and non-overlapping time
          const overlappingEvent1 = await BlogService.createBlog({
            title: 'Event 1',
            status: "TODO",
            startTime: new Date('2023-11-01T11:30:00Z'),
            endTime: new Date('2023-11-01T13:00:00Z'),
            invitees: ["Haoqing"],
          });
      
          const overlappingEvent2 = await BlogService.createBlog({
            title: 'Event 2',
            status: "TODO",
            startTime: new Date('2023-11-01T10:00:00Z'),
            endTime: new Date('2023-11-01T12:00:00Z'),
            invitees: ["Haoqing Xuan"],
          });
      
          const nonOverlappingEvent = await BlogService.createBlog({
            title: 'Event 3',
            status: "TODO",
            startTime: new Date('2023-11-01T14:00:00Z'),
            endTime: new Date('2023-11-01T15:00:00Z'),
          });
      
          // Create a user with these events
          const user = await UserService.createUser({
            name: 'Haoqing',
            events: [overlappingEvent1._id, overlappingEvent2._id, nonOverlappingEvent._id],
          });
      
          // Call the mergeAllEvents endpoint
          const response = await chai.request(app).put(`/api/users/${user._id}/mergeAllEvents`);
          response.should.have.status(200);
          response.body.should.have.property('data');
          response.body.should.have.property('status').eql('success');
      
          // Get the merged events
          const mergedEvents = response.body.data.events;
      
          // Fetch events from the database based on their IDs
          const mergedEvent = await BlogService.getBlogById(mergedEvents[0]);
      
          // Fetch the non-overlapping event from the database
          const retrievedNonOverlappingEvent = await BlogService.getBlogById(nonOverlappingEvent._id);
      
          // Assertions to check if events were merged correctly and non-overlapping event is retained
          mergedEvents.should.be.an('array').with.lengthOf(2);
          mergedEvent.should.have.property("startTime").eql(overlappingEvent2.startTime);
          mergedEvent.should.have.property("endTime").eql(overlappingEvent1.endTime);
      
          retrievedNonOverlappingEvent.should.have.property("title").eql(nonOverlappingEvent.title);
          retrievedNonOverlappingEvent.should.have.property("startTime").eql(nonOverlappingEvent.startTime);
          retrievedNonOverlappingEvent.should.have.property("endTime").eql(nonOverlappingEvent.endTime);
        });
      });
      

});
