const mongoose = require("mongoose");
const Professor = require("./models/Professor");

// connect to MongoDB (use same connection string as in server.js)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(async () => {
		console.log("MongoDB connected for seeding");

		await Professor.deleteMany(); // clear old data

		await Professor.insertMany([
			{
				name: "Alice Johnson",
				about: "Professor of Computer Science with focus on AI.",
				research: "Artificial Intelligence, Machine Learning, NLP",
				publications: "10+ papers in top journals",
				courses: "AI, ML, Data Structures",
				contact: "alice.johnson@university.edu"
			},
			{
				name: "Bob Smith",
				about: "Associate Professor of Mathematics",
				research: "Algebra, Number Theory",
				publications: "5 research papers",
				courses: "Linear Algebra, Calculus",
				contact: "bob.smith@university.edu"
			}
		]);

		console.log("Seed data inserted");
		process.exit();
	})
	.catch(err => console.error(err));
