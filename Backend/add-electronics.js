const sequelize = require('./config/database');
const Product = require('./models/Product');

const techProducts = [
  // --- FLAGSHIP SMARTPHONES ---
  {
    title: "Apple iPhone 16 Pro Max (256GB, Desert Titanium)",
    category: "electronics",
    brand: "Apple",
    price: 159900,
    originalPrice: 169900,
    discount: "6% off",
    rating: 4.9,
    reviews: 6200,
    sales: "15k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    description: "The ultimate flagship engineered with titanium finish and Camera Control button.\nSpecs: 8GB RAM | 256GB NVMe Storage | 6.9-inch 120Hz Super Retina XDR OLED | A18 Pro Chip\nUnmatched pro video capture with 4K 120 fps Dolby Vision recording."
  },
  {
    title: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 512GB)",
    category: "electronics",
    brand: "Samsung",
    price: 129999,
    originalPrice: 139999,
    discount: "7% off",
    rating: 4.8,
    reviews: 4500,
    sales: "12k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    description: "Built with titanium frame and Galaxy AI for live call translation & Circle to Search.\nSpecs: 12GB LPDDR5X RAM | 512GB UFS 4.0 | 200MP Quad Camera | Snapdragon 8 Gen 3\nIncludes embedded S Pen for precise note-taking and graphic illustration."
  },
  {
    title: "Google Pixel 9 Pro 5G (16GB RAM, 256GB Obsidian)",
    category: "electronics",
    brand: "Google",
    price: 109999,
    originalPrice: 119999,
    discount: "8% off",
    rating: 4.8,
    reviews: 2100,
    sales: "6k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
    description: "Google's powerful AI smartphone with Gemini Nano integrated on-device.\nSpecs: 16GB RAM | 256GB Storage | 50MP Triple Camera | Tensor G4 Chip\nSuper Actua display delivers up to 3000 nits peak outdoor brightness."
  },
  {
    title: "OnePlus 12 5G (16GB RAM, 512GB Silky Black)",
    category: "electronics",
    brand: "OnePlus",
    price: 69999,
    originalPrice: 74999,
    discount: "7% off",
    rating: 4.7,
    reviews: 3800,
    sales: "10k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80",
    description: "Smooth Beyond Belief performance tuned by 4th Gen Hasselblad Camera for Mobile.\nSpecs: 16GB LPDDR5X RAM | 512GB UFS 4.0 | 2K 120Hz AMOLED | Snapdragon 8 Gen 3\n100W SUPERVOOC charging powers phone from 1% to 100% in just 26 minutes."
  },

  // --- PREMIUM LAPTOPS ---
  {
    title: "Apple MacBook Pro M3 Max 16-inch (36GB RAM, 1TB SSD)",
    category: "electronics",
    brand: "Apple",
    price: 349900,
    originalPrice: 379900,
    discount: "8% off",
    rating: 4.9,
    reviews: 1450,
    sales: "4k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
    description: "Mind-blowing workstation speed engineered for code compilation and 8K rendering.\nSpecs: 36GB Unified Memory | 1TB NVMe SSD | 16.2-inch Liquid Retina XDR | M3 Max 14-Core\nSupports up to 4 external high-res displays with up to 22 hours battery life."
  },
  {
    title: "ASUS ROG Zephyrus G16 Gaming Laptop (RTX 4080)",
    category: "electronics",
    brand: "ASUS",
    price: 249990,
    originalPrice: 279990,
    discount: "11% off",
    rating: 4.8,
    reviews: 890,
    sales: "2k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    description: "Ultra-slim CNC aluminum gaming powerhouse featuring ROG Nebula OLED 240Hz screen.\nSpecs: 32GB LPDDR5X RAM | 1TB PCIe 4.0 SSD | 16-inch 2.5K 240Hz OLED | Intel Core Ultra 9\nPowered by NVIDIA GeForce RTX 4080 Laptop GPU with MUX Switch."
  },
  {
    title: "Dell XPS 15 9530 Touch Laptop (Core i9 13th Gen)",
    category: "electronics",
    brand: "Dell",
    price: 249990,
    originalPrice: 279990,
    discount: "11% off",
    rating: 4.7,
    reviews: 720,
    sales: "3k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
    description: "Precision crafted from machined aluminum with infinity-edge 3.5K OLED touch display.\nSpecs: 32GB DDR5 RAM | 1TB PCIe SSD | 15.6-inch 3.5K OLED Touch | RTX 4060 8GB\nStudio-quality quad speaker system tuned by Waves MaxxAudio Pro."
  },
  {
    title: "Lenovo ThinkPad X1 Carbon Gen 12 Ultrabook",
    category: "electronics",
    brand: "Lenovo",
    price: 189990,
    originalPrice: 209990,
    discount: "10% off",
    rating: 4.8,
    reviews: 1120,
    sales: "5k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
    description: "Ultralight carbon-fiber business laptop tested against 12 military-grade requirements.\nSpecs: 32GB LPDDR5X RAM | 1TB Gen 4 SSD | 14-inch 2.8K 120Hz OLED | Intel Core Ultra 7\nFeatures TrackPoint quick menu, Haptics glass touchpad, and fingerprint reader."
  },

  // --- AUDIO & WEARABLES ---
  {
    title: "Apple AirPods Pro (2nd Generation with USB-C)",
    category: "gadgets",
    brand: "Apple",
    price: 24900,
    originalPrice: 26900,
    discount: "7% off",
    rating: 4.9,
    reviews: 9400,
    sales: "25k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80",
    description: "Re-engineered for richer sound and up to 2x more Active Noise Cancellation.\nSpecs: H2 Audio Chip | USB-C MagSafe Case | IP54 Dust & Sweat Resistant | Adaptive Audio\nPersonalized Spatial Audio with dynamic head tracking for immersive sound."
  },
  {
    title: "Sony WF-1000XM5 Noise Canceling Wireless Earbuds",
    category: "gadgets",
    brand: "Sony",
    price: 24990,
    originalPrice: 29990,
    discount: "17% off",
    rating: 4.8,
    reviews: 4100,
    sales: "12k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    description: "The best noise-canceling earbuds with custom Dynamic Driver X unit for rich vocals.\nSpecs: V2 Processor | QN2e HD Noise Canceling Chip | High-Res LDAC Audio | 36-Hr Battery\nDual feedback microphones isolate real-world background noise."
  },
  {
    title: "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium",
    category: "gadgets",
    brand: "Apple",
    price: 89900,
    originalPrice: 94900,
    discount: "5% off",
    rating: 4.9,
    reviews: 2100,
    sales: "7k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80",
    description: "The most capable Apple Watch crafted with 95% recycled aerospace-grade titanium.\nSpecs: 3000 nits Display | Dual-Frequency Precision GPS | 100m Water Resistant | S9 SiP\nUp to 36 hours of normal battery life and up to 72 hours in Low Power Mode."
  },
  {
    title: "Samsung Galaxy Watch6 Classic 47mm LTE",
    category: "gadgets",
    brand: "Samsung",
    price: 36999,
    originalPrice: 40999,
    discount: "10% off",
    rating: 4.7,
    reviews: 2800,
    sales: "9k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
    description: "Timeless classic design equipped with iconic mechanical rotating bezel control.\nSpecs: 1.5-inch Sapphire Crystal AMOLED | Exynos W930 | ECG & BIA Sensor | 300mAh Battery\nAdvanced sleep coaching, heart rate zone guidance, and personalized workout metrics."
  },

  // --- PC COMPONENTS & ACCESSORIES ---
  {
    title: "NVIDIA GeForce RTX 4090 Founder Edition 24GB",
    category: "electronics",
    brand: "NVIDIA",
    price: 180000,
    originalPrice: 199000,
    discount: "10% off",
    rating: 4.9,
    reviews: 3100,
    sales: "5k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
    description: "The ultimate GeForce GPU delivering an enormous leap in performance & AI-powered graphics.\nSpecs: 24GB GDDR6X VRAM | 16384 CUDA Cores | 4th Gen Tensor Cores | DLSS 3 Frame Gen\nEngineered for 4K high refresh gaming and heavy Blender/8K CUDA ray tracing rendering."
  },
  {
    title: "Logitech MX Master 3S Wireless Performance Mouse",
    category: "gadgets",
    brand: "Logitech",
    price: 9995,
    originalPrice: 10995,
    discount: "9% off",
    rating: 4.9,
    reviews: 11200,
    sales: "30k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    description: "Iconic ergonomic mouse equipped with 8K DPI glass tracking and quiet click switches.\nSpecs: 8000 DPI Optical Sensor | MagSpeed Electromagnetic Scroll | Bluetooth & Logi Bolt\nFully customizable thumb wheel & gesture buttons across macOS and Windows."
  },
  {
    title: "Keychron K2 Pro QMK Wireless Mechanical Keyboard",
    category: "gadgets",
    brand: "Keychron",
    price: 10999,
    originalPrice: 12999,
    discount: "15% off",
    rating: 4.8,
    reviews: 2400,
    sales: "8k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    description: "Hot-swappable 75% layout custom wireless mechanical keyboard with double-shot PBT keycaps.\nSpecs: Gateron G Pro Mechanical Switches | QMK/VIA Programmable | RGB Backlight | 4000mAh\nSeamless Mac & Windows switching via Bluetooth 5.1 or Type-C wired connection."
  },

  // --- SMART HOME & GAMING ---
  {
    title: "Sony PlayStation 5 Slim Digital Edition Console",
    category: "electronics",
    brand: "Sony",
    price: 44990,
    originalPrice: 49990,
    discount: "10% off",
    rating: 4.8,
    reviews: 7400,
    sales: "20k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    description: "Sleek compact design packing 1TB ultra-fast SSD storage for instant game loading.\nSpecs: 1TB Custom NVMe SSD | 10.3 TFLOPS RDNA 2 GPU | DualSense Haptic Controller | 4K 120Hz\nFeatures 3D Audio Tech and high dynamic range ray tracing for stunning visual immersion."
  },
  {
    title: "Microsoft Xbox Series X 1TB Gaming Console",
    category: "electronics",
    brand: "Microsoft",
    price: 52990,
    originalPrice: 55990,
    discount: "5% off",
    rating: 4.8,
    reviews: 5300,
    sales: "15k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80",
    description: "The fastest, most powerful Xbox ever built with 12 teraflops of raw processing power.\nSpecs: 1TB NVMe Custom SSD | 12 TFLOPS RDNA 2 | 4K Gaming up to 120FPS | Quick Resume\nSupports Dolby Vision HDR and Dolby Atmos spatial audio for competitive gaming."
  },
  {
    title: "Amazon Echo Studio Hi-Fi Smart Speaker with Alexa",
    category: "gadgets",
    brand: "Amazon",
    price: 22999,
    originalPrice: 25999,
    discount: "12% off",
    rating: 4.7,
    reviews: 3200,
    sales: "10k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80",
    description: "Immersive 3D audio smart speaker featuring 5 directional speakers and room adaptation.\nSpecs: 330W Peak Power | 24-bit DAC | Dolby Atmos & Spatial Audio | Built-in Zigbee Hub\nStream HD music from Amazon Music, Apple Music, Spotify, and control smart devices."
  },

  // --- ADDITIONAL TECH ITEMS TO TOTAL 40+ ---
  {
    title: "Apple Studio Display 27-inch 5K Retina Monitor",
    category: "electronics",
    brand: "Apple",
    price: 159900,
    originalPrice: 169900,
    discount: "6% off",
    rating: 4.8,
    reviews: 850,
    sales: "3k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    description: "Immersive 5K Retina display featuring 12MP Ultra Wide camera with Center Stage.\nSpecs: 27-inch 5K Retina (5120x2880) | 600 nits Brightness | P3 Wide Color | A13 Bionic Chip\nStudio-quality 3-mic array and six-speaker sound system with Spatial Audio."
  },
  {
    title: "Samsung Odyssey OLED G9 49-inch Curved Gaming Monitor",
    category: "electronics",
    brand: "Samsung",
    price: 154999,
    originalPrice: 179999,
    discount: "14% off",
    rating: 4.9,
    reviews: 640,
    sales: "2k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    description: "Revolutionary 1800R curved DQHD OLED panel with blistering 0.03ms response time.\nSpecs: 49-inch DQHD (5120x1440) | 240Hz Refresh Rate | 0.03ms GTG | Neo Quantum Processor Pro\nSupports AMD FreeSync Premium Pro and Smart TV app ecosystem built-in."
  },
  {
    title: "GoPro HERO12 Black Action Camera",
    category: "gadgets",
    brand: "GoPro",
    price: 39990,
    originalPrice: 45000,
    discount: "11% off",
    rating: 4.8,
    reviews: 2900,
    sales: "9k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
    description: "Incredible 5.3K 60fps video quality with HyperSmooth 6.0 video stabilization.\nSpecs: 27MP Image Sensor | 5.3K 60FPS Video | 33ft Waterproof | Bluetooth Audio Support\nFeatures HDR video capture, vertical 9:16 capture mode, and extended battery runtime."
  },
  {
    title: "DJI Mini 4 Pro Fly More Combo Drone",
    category: "gadgets",
    brand: "DJI",
    price: 94990,
    originalPrice: 104990,
    discount: "10% off",
    rating: 4.9,
    reviews: 1450,
    sales: "4k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80",
    description: "Foldable mini drone under 249g packed with omnidirectional obstacle sensing.\nSpecs: 4K/60fps HDR Video | 48MP Photo | 34-Min Flight Time | 20km FHD Video Transmission\nSupports True Vertical Shooting, Waypoint Flight, and Advanced Return-to-Home."
  },
  {
    title: "Anker Prime 20,000mAh Power Bank (200W)",
    category: "gadgets",
    brand: "Anker",
    price: 12999,
    originalPrice: 14999,
    discount: "13% off",
    rating: 4.9,
    reviews: 3100,
    sales: "11k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1609592424074-b5299fa68cf3?w=800&q=80",
    description: "Multi-device ultra-high output battery bank with real-time smart digital display.\nSpecs: 200W Total Output | 20,000mAh Capacity | Dual USB-C 100W PD | Smart App Monitor\nCan fast charge a MacBook Pro 16-inch to 50% in just 28 minutes."
  },
  {
    title: "Sony Alpha 7 IV Full-Frame Mirrorless Camera",
    category: "electronics",
    brand: "Sony",
    price: 214990,
    originalPrice: 229990,
    discount: "7% off",
    rating: 4.9,
    reviews: 1180,
    sales: "3k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    description: "Hybrid perfection for filmmakers and photographers with 33MP Exmor R CMOS sensor.\nSpecs: 33MP Full-Frame Sensor | BIONZ XR Image Processor | 4K 60p 10-bit 4:2:2 | 759 AF Points\nReal-time Eye AF for Humans, Animals, and Birds in both photo and video modes."
  },
  {
    title: "Asus ROG Swift 360Hz Gaming Monitor",
    category: "electronics",
    brand: "ASUS",
    price: 54990,
    originalPrice: 62000,
    discount: "11% off",
    rating: 4.8,
    reviews: 950,
    sales: "3k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    description: "Designed for esports tournament play with blistering 360Hz refresh rate.\nSpecs: 24.5-inch FHD Fast IPS | 360Hz | 1ms GTG | NVIDIA Reflex Latency Analyzer\nCustom heatsink provides large surface area for heat exchange during long sessions."
  },
  {
    title: "Sennheiser HD 660S2 Open-Back Audiophile Headphones",
    category: "gadgets",
    brand: "Sennheiser",
    price: 49990,
    originalPrice: 54990,
    discount: "9% off",
    rating: 4.9,
    reviews: 820,
    sales: "2k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    description: "Precision-engineered open-back dynamic headphones delivering sub-bass impact.\nSpecs: 300-ohm Transducer Impedance | 8Hz - 41.5kHz Frequency | Velour Ear Cushions | 104dB SPL\nUnmatched natural acoustic tuning with relaxed treble and deep impactful bass."
  },
  {
    title: "Steam Deck OLED 1TB Handheld Gaming Console",
    category: "electronics",
    brand: "Valve",
    price: 64990,
    originalPrice: 69990,
    discount: "7% off",
    rating: 4.9,
    reviews: 4200,
    sales: "14k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    description: "The ultimate portable PC gaming handheld featuring bright HDR OLED screen.\nSpecs: 7.4-inch 90Hz HDR OLED | 1TB NVMe SSD | Custom AMD APU | Wi-Fi 6E | 50Wh Battery\nPlays thousands of AAA Steam games natively with full button & trackpad customization."
  },
  {
    title: "Razer DeathAdder V3 Pro Wireless Gaming Mouse",
    category: "gadgets",
    brand: "Razer",
    price: 13999,
    originalPrice: 15999,
    discount: "13% off",
    rating: 4.8,
    reviews: 3400,
    sales: "10k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    description: "Ultra-lightweight 63g ergonomic esports wireless mouse built for high precision.\nSpecs: Focus Pro 30K Optical Sensor | 90-Hour Battery | Gen-3 Optical Switches | HyperSpeed Wireless\nRefined ergonomic shape co-developed with top esports professional players."
  },
  {
    title: "Elgato Stream Deck MK.2 Studio Controller",
    category: "gadgets",
    brand: "Elgato",
    price: 14999,
    originalPrice: 16999,
    discount: "12% off",
    rating: 4.8,
    reviews: 2800,
    sales: "8k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    description: "15 customizable LCD keys to trigger unlimited actions across streaming & desktop apps.\nSpecs: 15 LCD Keys | USB 2.0 | Interchangeable Faceplates | OBS & Twitch Native Integration\nOne-touch tactile control to switch scenes, launch media, adjust audio, and run macros."
  },
  {
    title: "Bose Smart Soundbar 900 with Dolby Atmos",
    category: "electronics",
    brand: "Bose",
    price: 84900,
    originalPrice: 99900,
    discount: "15% off",
    rating: 4.8,
    reviews: 1950,
    sales: "6k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80",
    description: "Immersive soundbar featuring seven custom drivers including up-firing dipole transducers.\nSpecs: PhaseGuide Tech | eARC HDMI & Optical | Wi-Fi & Bluetooth | Voice Assistant Built-in\nSeparates instruments, dialogue, and effects to place sound in precise areas of the room."
  },
  {
    title: "Western Digital Black 2TB NVMe Gen4 Gaming SSD",
    category: "electronics",
    brand: "Western Digital",
    price: 16999,
    originalPrice: 19999,
    discount: "15% off",
    rating: 4.9,
    reviews: 5100,
    sales: "16k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80",
    description: "Blistering PCIe Gen4 speeds reaching up to 7300 MB/s read performance.\nSpecs: 2TB Capacity | 7300 MB/s Read | 6600 MB/s Write | Heatsink Included | PS5 Compatible\nReduces game load times drastically with custom Game Mode 2.0 storage acceleration."
  },
  {
    title: "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz RAM",
    category: "electronics",
    brand: "Corsair",
    price: 12999,
    originalPrice: 14999,
    discount: "13% off",
    rating: 4.8,
    reviews: 3200,
    sales: "10k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
    description: "High-frequency DDR5 memory optimized for Intel and AMD motherboard chipsets.\nSpecs: 32GB (2x16GB) | 6000MHz CL36 | Dynamic 10-Zone RGB Lighting | XMP 3.0 Support\nSolid aluminum heatspreader provides efficient cooling for extreme memory overclocking."
  },
  {
    title: "Samsung T7 Shield 2TB Portable External SSD",
    category: "gadgets",
    brand: "Samsung",
    price: 15999,
    originalPrice: 18999,
    discount: "16% off",
    rating: 4.9,
    reviews: 4800,
    sales: "18k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80",
    description: "Rugged rubberized external storage engineered with IP65 water and dust resistance.\nSpecs: 2TB Storage | USB 3.2 Gen 2 | 1050 MB/s Read Speed | 3-Meter Drop Resistant\nIdeal for outdoor location shoots with password protection via AES 256-bit encryption."
  },
  {
    title: "Logitech Brio 4K Ultra HD Webcam with HDR",
    category: "gadgets",
    brand: "Logitech",
    price: 18995,
    originalPrice: 21995,
    discount: "14% off",
    rating: 4.7,
    reviews: 2600,
    sales: "8k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    description: "Premium 4K web camera featuring RightLight 3 HDR auto light adjustment.\nSpecs: 4K 30fps / 1080p 60fps | Dual Omnidirectional Mics | Windows Hello Facial Rec | 90° FOV\n5x digital zoom with three field of view presets for professional remote meetings."
  },
  {
    title: "Sonos Era 300 Spatial Audio Smart Speaker",
    category: "electronics",
    brand: "Sonos",
    price: 49999,
    originalPrice: 54999,
    discount: "9% off",
    rating: 4.8,
    reviews: 1100,
    sales: "3k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80",
    description: "Revolutionary acoustic design housing six drivers to project sound wall-to-wall.\nSpecs: Six Drivers | Dolby Atmos Spatial Audio | Trueplay Tuning | Wi-Fi 6 & Bluetooth 5.0\nSeamlessly integrates with Apple AirPlay 2 and Sonos multi-room sound system."
  },
  {
    title: "Garmin Fenix 7X Pro Solar Multisport GPS Watch",
    category: "gadgets",
    brand: "Garmin",
    price: 94990,
    originalPrice: 104990,
    discount: "10% off",
    rating: 4.9,
    reviews: 890,
    sales: "2k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80",
    description: "Ultimate outdoor solar-charging multisport watch with built-in LED flashlight.\nSpecs: Power Sapphire Lens | 37-Day Battery Life | Multi-Band TopoActive Maps | 1.4-inch Screen\n24/7 health tracking, endurance score, Hill score, and SATIQ multi-band GPS positioning."
  },
  {
    title: "Kindle Scribe 64GB Digital Notebook & eReader",
    category: "gadgets",
    brand: "Amazon",
    price: 38999,
    originalPrice: 42999,
    discount: "9% off",
    rating: 4.8,
    reviews: 1750,
    sales: "5k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    description: "First Kindle for reading and writing with 10.2-inch glare-free Paperwhite display.\nSpecs: 10.2-inch 300 ppi E-Ink Display | Premium Pen Included | 64GB Storage | Weeks of Battery\nHandwrite notes on PDFs, journal, create sticky notes inside digital books."
  },
  {
    title: "MSI GeForce RTX 4080 Super 16GB Gaming Graphics Card",
    category: "electronics",
    brand: "MSI",
    price: 114990,
    originalPrice: 129990,
    discount: "12% off",
    rating: 4.8,
    reviews: 1400,
    sales: "4k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
    description: "TRI FROZR 3 thermal design with TORX Fan 5.0 for extreme high FPS 4K gaming.\nSpecs: 16GB GDDR6X VRAM | 10240 CUDA Cores | Dual BIOS | Airflow Control Heatsink\nReinforced metal backplate and anti-bending bracket included."
  },
  {
    title: "HyperX Cloud III Wireless Gaming Headset",
    category: "gadgets",
    brand: "HyperX",
    price: 13990,
    originalPrice: 15990,
    discount: "13% off",
    rating: 4.7,
    reviews: 4200,
    sales: "12k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    description: "Legendary HyperX memory foam comfort with up to 120 hours of battery life.\nSpecs: 53mm Angled Drivers | 120-Hour Battery | 2.4GHz Low Latency Wireless | DTS Headphone:X\nNoise-canceling ultra-clear 10mm microphone with LED mute indicator."
  },
  {
    title: "LG C3 65-inch 4K Smart OLED EVO TV",
    category: "electronics",
    brand: "LG",
    price: 199990,
    originalPrice: 239990,
    discount: "17% off",
    rating: 4.9,
    reviews: 2100,
    sales: "6k+ bought",
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
    description: "Self-lit OLED pixels powered by alpha9 AI Processor Gen6 for perfect contrast.\nSpecs: 65-inch 4K OLED EVO | 120Hz Native | Dolby Vision IQ & Atmos | 4x HDMI 2.1 Ports\nUltra-fast 0.1ms response time with NVIDIA G-SYNC & AMD FreeSync Premium."
  }
];

async function injectTechProducts() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();

    console.log(`Injecting ${techProducts.length} latest tech & electronic items into SQLite database (preserving existing data)...`);
    const saved = await Product.bulkCreate(techProducts);

    console.log(`Successfully injected 40+ Latest Tech Flagships & Electronics into the E-Bazaar database!`);
    process.exit(0);
  } catch (error) {
    console.error('Error injecting tech products:', error.message);
    process.exit(1);
  }
}

injectTechProducts();
