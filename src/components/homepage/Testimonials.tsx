
import React from 'react';
import { Trophy } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      age: 28,
      quote: "I found my perfect match within two weeks of joining! The AI matching actually works, and the verification process made me feel so much safer than on other dating apps.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&auto=format&fit=crop"
    },
    {
      name: "Michael T.",
      age: 32,
      quote: "The verification process gave me peace of mind that I was talking to real people. The conversation starters feature helped me break the ice easily.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&auto=format&fit=crop"
    },
    {
      name: "Jennifer K.",
      age: 26,
      quote: "The compatibility quiz matched me with people I actually connect with. After countless failed attempts on other dating apps, I finally met someone special here.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&auto=format&fit=crop"
    },
    {
      name: "David L.",
      age: 30,
      quote: "What sets LoveQuest apart is the quality of people. Everyone I've met has been genuine and looking for something real - not just hookups.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&auto=format&fit=crop"
    },
    {
      name: "Rebecca W.",
      age: 34,
      quote: "The Premium membership was completely worth it. I got more meaningful matches in one month than a year on other dating platforms.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--love-100),transparent_70%)]" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <Trophy size={18} className="text-love-500 mr-2" />
            <span className="text-sm font-medium text-love-700">Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            What Our Members Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands who've found meaningful connections through our AI-powered matching.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 overflow-hidden relative">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow card-hover">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-love-100"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.age} years old</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-2 -left-2 text-4xl text-love-200">"</div>
                <p className="italic text-gray-700 relative z-10 pl-4">{testimonial.quote}</p>
                <div className="absolute -bottom-4 -right-2 text-4xl text-love-200">"</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-8 gap-2">
          {[0, 1].map((dot) => (
            <button key={dot} className={`w-3 h-3 rounded-full ${dot === 0 ? 'bg-love-500' : 'bg-love-200'}`}></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
