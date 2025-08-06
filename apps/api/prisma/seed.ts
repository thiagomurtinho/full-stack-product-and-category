import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: 'Electronics', slug: 'electronics', parentId: null },
  { name: 'Computers', slug: 'computers', parentId: 'electronics' },
  { name: 'Laptops', slug: 'laptops', parentId: 'computers' },
  { name: 'Gaming Laptops', slug: 'gaming-laptops', parentId: 'laptops' },
  { name: 'Business Laptops', slug: 'business-laptops', parentId: 'laptops' },
  { name: 'Desktops', slug: 'desktops', parentId: 'computers' },
  { name: 'Gaming Desktops', slug: 'gaming-desktops', parentId: 'desktops' },
  { name: 'Workstations', slug: 'workstations', parentId: 'desktops' },
  { name: 'Components', slug: 'components', parentId: 'computers' },
  { name: 'Processors', slug: 'processors', parentId: 'components' },
  { name: 'Graphics Cards', slug: 'graphics-cards', parentId: 'components' },
  { name: 'Memory', slug: 'memory', parentId: 'components' },
  { name: 'Storage', slug: 'storage', parentId: 'components' },
  { name: 'SSDs', slug: 'ssds', parentId: 'storage' },
  { name: 'HDDs', slug: 'hdds', parentId: 'storage' },
  { name: 'Mobile', slug: 'mobile', parentId: 'electronics' },
  { name: 'Smartphones', slug: 'smartphones', parentId: 'mobile' },
  { name: 'Tablets', slug: 'tablets', parentId: 'mobile' },
  { name: 'Wearables', slug: 'wearables', parentId: 'mobile' },
  { name: 'Smartwatches', slug: 'smartwatches', parentId: 'wearables' },
  { name: 'Audio', slug: 'audio', parentId: 'electronics' },
  { name: 'Headphones', slug: 'headphones', parentId: 'audio' },
  { name: 'Speakers', slug: 'speakers', parentId: 'audio' },
  { name: 'Microphones', slug: 'microphones', parentId: 'audio' },
  { name: 'Gaming', slug: 'gaming', parentId: 'electronics' },
  { name: 'Consoles', slug: 'consoles', parentId: 'gaming' },
  { name: 'Controllers', slug: 'controllers', parentId: 'gaming' },
  { name: 'Accessories', slug: 'accessories', parentId: 'electronics' },
  { name: 'Cables', slug: 'cables', parentId: 'accessories' },
  { name: 'Adapters', slug: 'adapters', parentId: 'accessories' },
  { name: 'Smart Home', slug: 'smart-home', parentId: 'electronics' },
  { name: 'Lighting', slug: 'lighting', parentId: 'smart-home' },
  { name: 'Security', slug: 'security', parentId: 'smart-home' },
]

const products = [
  {
    name: 'MacBook Pro 16-inch',
    slug: 'macbook-pro-16-inch',
    description: 'Powerful laptop with M2 Pro chip, 16GB RAM, 512GB SSD',
    price: 2499.99,
    categorySlugs: ['electronics', 'computers', 'laptops', 'business-laptops']
  },
  {
    name: 'Dell XPS 13',
    slug: 'dell-xps-13',
    description: 'Ultra-thin laptop with 13.4-inch display and Intel i7',
    price: 1299.99,
    categorySlugs: ['electronics', 'computers', 'laptops', 'business-laptops']
  },
  {
    name: 'ASUS ROG Strix G15',
    slug: 'asus-rog-strix-g15',
    description: 'Gaming laptop with RTX 4070, AMD Ryzen 7, 16GB RAM',
    price: 1499.99,
    categorySlugs: ['electronics', 'computers', 'laptops', 'gaming-laptops', 'gaming']
  },
  {
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    description: 'Latest iPhone with A17 Pro chip, 48MP camera, titanium design',
    price: 999.99,
    categorySlugs: ['electronics', 'mobile', 'smartphones']
  },
  {
    name: 'Samsung Galaxy S24',
    slug: 'samsung-galaxy-s24',
    description: 'Android flagship with Snapdragon 8 Gen 3, 200MP camera',
    price: 899.99,
    categorySlugs: ['electronics', 'mobile', 'smartphones']
  },
  {
    name: 'iPad Pro 12.9-inch',
    slug: 'ipad-pro-12-9-inch',
    description: 'Professional tablet with M2 chip and Liquid Retina XDR display',
    price: 1099.99,
    categorySlugs: ['electronics', 'mobile', 'tablets']
  },
  {
    name: 'Apple Watch Series 9',
    slug: 'apple-watch-series-9',
    description: 'Smartwatch with S9 chip, health monitoring, GPS',
    price: 399.99,
    categorySlugs: ['electronics', 'mobile', 'wearables', 'smartwatches']
  },
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    description: 'Premium noise-cancelling headphones with 30-hour battery',
    price: 399.99,
    categorySlugs: ['electronics', 'audio', 'headphones']
  },
  {
    name: 'AirPods Pro 2nd Gen',
    slug: 'airpods-pro-2nd-gen',
    description: 'Wireless earbuds with active noise cancellation and spatial audio',
    price: 249.99,
    categorySlugs: ['electronics', 'audio', 'headphones']
  },
  {
    name: 'JBL Flip 6',
    slug: 'jbl-flip-6',
    description: 'Portable Bluetooth speaker with waterproof design',
    price: 129.99,
    categorySlugs: ['electronics', 'audio', 'speakers']
  },
  {
    name: 'Blue Yeti X',
    slug: 'blue-yeti-x',
    description: 'Professional USB microphone with RGB lighting',
    price: 169.99,
    categorySlugs: ['electronics', 'audio', 'microphones']
  },
  {
    name: 'PlayStation 5',
    slug: 'playstation-5',
    description: 'Next-gen gaming console with DualSense controller',
    price: 499.99,
    categorySlugs: ['electronics', 'gaming', 'consoles']
  },
  {
    name: 'Xbox Series X',
    slug: 'xbox-series-x',
    description: 'Microsoft gaming console with 4K gaming and Game Pass',
    price: 499.99,
    categorySlugs: ['electronics', 'gaming', 'consoles']
  },
  {
    name: 'Nintendo Switch OLED',
    slug: 'nintendo-switch-oled',
    description: 'Hybrid gaming console with 7-inch OLED screen',
    price: 349.99,
    categorySlugs: ['electronics', 'gaming', 'consoles']
  },
  {
    name: 'DualSense Controller',
    slug: 'dualsense-controller',
    description: 'PlayStation 5 controller with haptic feedback',
    price: 69.99,
    categorySlugs: ['electronics', 'gaming', 'controllers']
  },
  {
    name: 'Xbox Wireless Controller',
    slug: 'xbox-wireless-controller',
    description: 'Xbox Series X controller with textured grip',
    price: 59.99,
    categorySlugs: ['electronics', 'gaming', 'controllers']
  },
  {
    name: 'Intel Core i9-13900K',
    slug: 'intel-core-i9-13900k',
    description: '24-core processor with 5.8GHz boost clock',
    price: 589.99,
    categorySlugs: ['electronics', 'computers', 'components', 'processors']
  },
  {
    name: 'AMD Ryzen 9 7950X',
    slug: 'amd-ryzen-9-7950x',
    description: '16-core processor with 5.7GHz boost clock',
    price: 699.99,
    categorySlugs: ['electronics', 'computers', 'components', 'processors']
  },
  {
    name: 'NVIDIA RTX 4090',
    slug: 'nvidia-rtx-4090',
    description: '24GB GDDR6X graphics card with ray tracing',
    price: 1599.99,
    categorySlugs: ['electronics', 'computers', 'components', 'graphics-cards', 'gaming']
  },
  {
    name: 'AMD RX 7900 XTX',
    slug: 'amd-rx-7900-xtx',
    description: '24GB GDDR6 graphics card with FSR 3.0',
    price: 999.99,
    categorySlugs: ['electronics', 'computers', 'components', 'graphics-cards', 'gaming']
  },
  {
    name: 'Corsair Vengeance 32GB',
    slug: 'corsair-vengeance-32gb',
    description: 'DDR5-6000 memory kit with RGB lighting',
    price: 199.99,
    categorySlugs: ['electronics', 'computers', 'components', 'memory']
  },
  {
    name: 'Samsung 970 EVO Plus 1TB',
    slug: 'samsung-970-evo-plus-1tb',
    description: 'NVMe SSD with 3500MB/s read speed',
    price: 89.99,
    categorySlugs: ['electronics', 'computers', 'components', 'storage', 'ssds']
  },
  {
    name: 'Western Digital Black 4TB',
    slug: 'western-digital-black-4tb',
    description: 'High-performance HDD with 7200 RPM',
    price: 149.99,
    categorySlugs: ['electronics', 'computers', 'components', 'storage', 'hdds']
  },
  {
    name: 'Philips Hue Bridge',
    slug: 'philips-hue-bridge',
    description: 'Smart lighting hub for controlling Hue bulbs',
    price: 59.99,
    categorySlugs: ['electronics', 'smart-home', 'lighting']
  },
  {
    name: 'Ring Video Doorbell Pro',
    slug: 'ring-video-doorbell-pro',
    description: '1080p video doorbell with motion detection',
    price: 249.99,
    categorySlugs: ['electronics', 'smart-home', 'security']
  },
  {
    name: 'Arlo Pro 4',
    slug: 'arlo-pro-4',
    description: '2K security camera with night vision and spotlight',
    price: 199.99,
    categorySlugs: ['electronics', 'smart-home', 'security']
  },
  {
    name: 'Belkin USB-C Cable',
    slug: 'belkin-usb-c-cable',
    description: 'High-speed USB-C cable with 100W power delivery',
    price: 19.99,
    categorySlugs: ['electronics', 'accessories', 'cables']
  },
  {
    name: 'Anker PowerCore 26800',
    slug: 'anker-powercore-26800',
    description: '26800mAh portable charger with USB-C and USB-A',
    price: 79.99,
    categorySlugs: ['electronics', 'accessories']
  },
  {
    name: 'Logitech MX Master 3',
    slug: 'logitech-mx-master-3',
    description: 'Wireless mouse with MagSpeed scroll and ergonomic design',
    price: 99.99,
    categorySlugs: ['electronics', 'accessories']
  },
  {
    name: 'Keychron Q1',
    slug: 'keychron-q1',
    description: 'Mechanical keyboard with hot-swappable switches',
    price: 199.99,
    categorySlugs: ['electronics', 'accessories', 'gaming']
  },
  {
    name: 'LG C3 OLED 65-inch',
    slug: 'lg-c3-oled-65-inch',
    description: '4K OLED TV with AI processing and gaming features',
    price: 2499.99,
    categorySlugs: ['electronics']
  },
  {
    name: 'Samsung QN90C 75-inch',
    slug: 'samsung-qn90c-75-inch',
    description: 'Neo QLED 4K TV with Mini LED technology',
    price: 2999.99,
    categorySlugs: ['electronics']
  },
  {
    name: 'Sony WH-1000XM4',
    slug: 'sony-wh-1000xm4',
    description: 'Previous generation noise-cancelling headphones',
    price: 349.99,
    categorySlugs: ['electronics', 'audio', 'headphones']
  },
  {
    name: 'Bose QuietComfort 45',
    slug: 'bose-quietcomfort-45',
    description: 'Comfortable noise-cancelling headphones',
    price: 329.99,
    categorySlugs: ['electronics', 'audio', 'headphones']
  },
  {
    name: 'Sennheiser HD 660S',
    slug: 'sennheiser-hd-660s',
    description: 'Open-back headphones for audiophiles',
    price: 499.99,
    categorySlugs: ['electronics', 'audio', 'headphones']
  },
  {
    name: 'Audio-Technica AT2020',
    slug: 'audio-technica-at2020',
    description: 'Cardioid condenser microphone for recording',
    price: 99.99,
    categorySlugs: ['electronics', 'audio', 'microphones']
  },
  {
    name: 'Shure SM7B',
    slug: 'shure-sm7b',
    description: 'Dynamic microphone used by podcasters and streamers',
    price: 399.99,
    categorySlugs: ['electronics', 'audio', 'microphones']
  },
  {
    name: 'Sonos Beam',
    slug: 'sonos-beam',
    description: 'Smart soundbar with voice control and HDMI ARC',
    price: 449.99,
    categorySlugs: ['electronics', 'audio', 'speakers']
  },
  {
    name: 'Bose SoundLink Revolve+',
    slug: 'bose-soundlink-revolve-plus',
    description: '360-degree portable speaker with 16-hour battery',
    price: 299.99,
    categorySlugs: ['electronics', 'audio', 'speakers']
  },
  {
    name: 'Google Nest Hub',
    slug: 'google-nest-hub',
    description: 'Smart display with Google Assistant and touchscreen',
    price: 99.99,
    categorySlugs: ['electronics', 'smart-home']
  },
  {
    name: 'Amazon Echo Dot',
    slug: 'amazon-echo-dot',
    description: 'Smart speaker with Alexa voice assistant',
    price: 49.99,
    categorySlugs: ['electronics', 'smart-home']
  },
  {
    name: 'Apple HomePod mini',
    slug: 'apple-homepod-mini',
    description: 'Smart speaker with Siri and spatial audio',
    price: 99.99,
    categorySlugs: ['electronics', 'smart-home']
  },
  {
    name: 'DJI Mini 3 Pro',
    slug: 'dji-mini-3-pro',
    description: 'Lightweight drone with 4K camera and obstacle avoidance',
    price: 759.99,
    categorySlugs: ['electronics']
  },
  {
    name: 'GoPro Hero 11 Black',
    slug: 'gopro-hero-11-black',
    description: 'Action camera with 5.3K video and HyperSmooth 5.0',
    price: 399.99,
    categorySlugs: ['electronics']
  },
  {
    name: 'Canon EOS R6 Mark II',
    slug: 'canon-eos-r6-mark-ii',
    description: 'Full-frame mirrorless camera with 24.2MP sensor',
    price: 2499.99,
    categorySlugs: ['electronics']
  },
  {
    name: 'Sony A7 IV',
    slug: 'sony-a7-iv',
    description: 'Full-frame mirrorless camera with 33MP sensor',
    price: 2499.99,
    categorySlugs: ['electronics']
  },
  {
    name: 'Fujifilm X-T5',
    slug: 'fujifilm-x-t5',
    description: 'APS-C mirrorless camera with 40MP sensor',
    price: 1699.99,
    categorySlugs: ['electronics']
  },
  {
    name: 'Nikon Z6 II',
    slug: 'nikon-z6-ii',
    description: 'Full-frame mirrorless camera with dual processors',
    price: 1999.99,
    categorySlugs: ['electronics']
  },
  {
    name: 'Panasonic Lumix GH6',
    slug: 'panasonic-lumix-gh6',
    description: 'Micro Four Thirds camera with 5.7K video',
    price: 2199.99,
    categorySlugs: ['electronics']
  },
  {
    name: 'Leica M11',
    slug: 'leica-m11',
    description: 'Rangefinder camera with 60MP sensor',
    price: 8995.00,
    categorySlugs: ['electronics']
  },
  {
    name: 'Hasselblad X2D 100C',
    slug: 'hasselblad-x2d-100c',
    description: 'Medium format camera with 100MP sensor',
    price: 8200.00,
    categorySlugs: ['electronics']
  }
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  console.log('✅ Database cleaned')

  // Create categories
  const categoryMap = new Map<string, string>()
  
  for (const category of categories) {
    const created = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        parentId: category.parentId ? categoryMap.get(category.parentId) : null
      }
    })
    categoryMap.set(category.slug, created.id)
  }

  console.log(`✅ Created ${categories.length} categories`)

  // Create products
  for (const product of products) {
    const categoryIds = product.categorySlugs.map(slug => categoryMap.get(slug)!).filter(Boolean)
    
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        categories: {
          connect: categoryIds.map(id => ({ id }))
        }
      }
    })
  }

  console.log(`✅ Created ${products.length} products`)
  console.log('🎉 Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 