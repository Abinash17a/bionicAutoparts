import Link from 'next/link';

// Sample blog data with random image URLs
const blogData = [
  {
    id: 1,
    title: "How to Maintain Your Car for Optimal Performance",
    description: "Regular maintenance is essential for keeping your vehicle in top shape. Learn the best practices to ensure your car runs smoothly and efficiently.",
    image: "https://picsum.photos/800/400?random=1",
  },
  {
    id: 2,
    title: "Top 5 Car Maintenance Tips",
    description: "Discover the top 5 tips to keep your car in great condition and enhance its lifespan.",
    image: "https://picsum.photos/800/400?random=2",
  },
  {
    id: 3,
    title: "Understanding Your Car's Warning Lights",
    description: "Learn what those warning lights on your dashboard mean and how to respond to them.",
    image: "https://picsum.photos/800/400?random=3",
  },
  {
    id: 4,
    title: "The Importance of Regular Oil Changes",
    description: "Find out why regular oil changes are crucial for your car's performance and longevity.",
    image: "https://picsum.photos/800/400?random=4",
  },
  {
    id: 5,
    title: "Choosing the Right Tires for Your Vehicle",
    description: "Explore the different types of tires and how to choose the right ones for your vehicle.",
    image: "https://picsum.photos/800/400?random=5",
  },
];

export default function Blogs() {
  return (
    <section className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Blogs</h1>
      <p className="text-center text-lg mb-8">Read our latest blogs on car maintenance and more.</p>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-3/4">
          <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
          <div className="space-y-6">
            {blogData.map((blog) => (
              <div key={blog.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <img src={blog.image} alt={`Blog Post ${blog.id}`} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{blog.title}</h3>
                  <p className="text-gray-600 mb-2">{blog.description}</p>
                  <Link href={`/blogs/${blog.id}`} className="text-blue-600 hover:underline">
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
