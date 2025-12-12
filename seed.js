import 'dotenv/config';
import mongoose from 'mongoose';
import Service from './models/Service.js';
import Provider from './models/Provider.js';

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Clear old data
    await Service.deleteMany({});
    await Provider.deleteMany({});

    // Create services
    const services = await Service.create([
      { name: "Plumbing", description: "Fix leaks, install pipes, unblock drains" },
      { name: "House Cleaning", description: "Deep clean, regular cleaning, move-in/out" },
      { name: "Electrical", description: "Wiring, repairs, socket installation" },
      { name: "Painting", description: "Interior & exterior painting, wall repairs" },
      { name: "Gardening", description: "Lawn mowing, flower beds, tree trimming" }
    ]);

    console.log('Services added');

    // Create providers
    await Provider.create([
      { name: "John the Plumber", service: services[0]._id, phone: "2547123123", price: 1000 },
      { name: "Mary Cleaner", service: services[1]._id, phone: "2547988877", price: 800 },
      { name: "Alex Electrician", service: services[2]._id, phone: "2547012345", price: 1500 },
      { name: "Grace Painter", service: services[3]._id, phone: "2547567890", price: 1200 },
      { name: "Kevin Gardener", service: services[4]._id, phone: "2547456789", price: 900 }
    ]);

    console.log('Providers added');

    console.log('Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDB();
