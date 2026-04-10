const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
require('dotenv').config();
const Service = require('./models/Service');
const Portfolio = require('./models/Portfolio');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected');

    // Sample Services
    const sampleServices = [
      {
        title: 'Wedding Photography',
        description: 'Professional wedding day coverage with beautiful composition and natural lighting. Includes pre-wedding preparations, ceremony, and reception.',
        category: 'photography',
        price: 1500,
        duration: '8 Hours',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=300&fit=crop',
      },
      {
        title: 'Pre-Wedding Shoot',
        description: 'Romantic pre-wedding photoshoot at scenic locations. Perfect for couples who want to showcase their love story.',
        category: 'photography',
        price: 800,
        duration: '4 Hours',
        image: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=500&h=300&fit=crop',
      },
      {
        title: 'Corporate Event Photography',
        description: 'Professional coverage of corporate events, conferences, and business gatherings with high-quality editing.',
        category: 'photography',
        price: 600,
        duration: '6 Hours',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
      },
      {
        title: 'Wedding Videography',
        description: 'Cinematic wedding videos with professional color grading and editing. Captures all the special moments of your big day.',
        category: 'videography',
        price: 2500,
        duration: '8 Hours',
        image: 'https://images.unsplash.com/photo-1516035893752-42145b848e98?w=500&h=300&fit=crop',
      },
      {
        title: 'Event Videography',
        description: 'High-quality video coverage for corporate events, product launches, and promotional videos with professional editing.',
        category: 'videography',
        price: 1200,
        duration: '4 Hours',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
      },
      {
        title: 'Portrait Session',
        description: 'Professional portrait photography session for individuals, families, or professional headshots in studio or outdoor settings.',
        category: 'photography',
        price: 300,
        duration: '2 Hours',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=300&fit=crop',
      },
      {
        title: 'Video Editing & Color Grading',
        description: 'Professional editing of your raw footage with color grading, transitions, and sound design for a polished final product.',
        category: 'editing',
        price: 400,
        duration: 'Variable',
        image: 'https://images.unsplash.com/photo-1633614503674-c8e9d8286a8d?w=500&h=300&fit=crop',
      },
      {
        title: 'Complete Wedding Package',
        description: 'All-inclusive package: Photography (8 hrs), Videography (8 hrs), Pre-wedding shoot, albums, and same-day edits.',
        category: 'package',
        price: 3500,
        duration: '8+ Hours',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=300&fit=crop',
      },
    ];

    // Sample Portfolio Items
    const samplePortfolio = [
      {
        title: 'Sunset Beach Wedding',
        description: 'A beautiful sunset wedding ceremony on the beach with golden hour lighting and emotional moments captured.',
        category: 'wedding',
        mediaType: 'image',
        mediaURL: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
        featured: true,
      },
      {
        title: 'Urban Pre-Wedding Couple',
        description: 'Romantic couple photoshoot in a modern city setting with urban backgrounds and natural poses.',
        category: 'wedding',
        mediaType: 'image',
        mediaURL: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800&h=600&fit=crop',
        featured: true,
      },
      {
        title: 'Corporate Event Highlights',
        description: 'Professional coverage of a corporate tech conference with keynote speakers and networking moments.',
        category: 'event',
        mediaType: 'image',
        mediaURL: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
        featured: false,
      },
      {
        title: 'Family Portrait Session',
        description: 'Heartwarming family portraits in a studio setting with professional lighting and poses.',
        category: 'portrait',
        mediaType: 'image',
        mediaURL: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop',
        featured: true,
      },
      {
        title: 'Wedding Highlights Video',
        description: 'Cinematic wedding video highlighting the most emotional and beautiful moments of the wedding day.',
        category: 'wedding',
        mediaType: 'video',
        mediaURL: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        featured: true,
      },
      {
        title: 'Product Launch Event',
        description: 'Professional video coverage of a tech product launch with audience reactions and keynote speech.',
        category: 'event',
        mediaType: 'video',
        mediaURL: 'https://www.youtube.com/embed/jNQXAC9IVRw',
        featured: false,
      },
      {
        title: 'Bride Getting Ready',
        description: 'Candid moments of the bride preparing for the wedding day with emotional details and expressions.',
        category: 'wedding',
        mediaType: 'image',
        mediaURL: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=600&fit=crop',
        featured: false,
      },
      {
        title: 'Professional Headshots',
        description: 'Studio headshots for business professionals and corporate executives with clean backgrounds.',
        category: 'portrait',
        mediaType: 'image',
        mediaURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        featured: false,
      },
    ];

    // Clear existing data (optional, uncomment to force refresh)
    await Service.deleteMany({});
    await Portfolio.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Check if data already exists
    const existingServices = await Service.countDocuments();
    const existingPortfolio = await Portfolio.countDocuments();

    if (existingServices > 0) {
      console.log(`⚠️ Services already exist (${existingServices} found). Skipping service creation.`);
    } else {
      await Service.insertMany(sampleServices);
      console.log(`✅ ${sampleServices.length} sample services added successfully!`);
    }

    if (existingPortfolio > 0) {
      console.log(`⚠️ Portfolio items already exist (${existingPortfolio} found). Skipping portfolio creation.`);
    } else {
      await Portfolio.insertMany(samplePortfolio);
      console.log(`✅ ${samplePortfolio.length} sample portfolio items added successfully!`);
    }

    console.log('');
    console.log('📊 Data Summary:');
    console.log(`   Total Services: ${await Service.countDocuments()}`);
    console.log(`   Total Portfolio Items: ${await Portfolio.countDocuments()}`);
    console.log('');
    console.log('🚀 Your application is ready!');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend: http://localhost:5000');
    console.log('   Admin Panel: http://localhost:3000/admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedData();
