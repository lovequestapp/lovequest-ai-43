
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "How does the AI matching work?",
      answer: "Our proprietary AI analyzes over 100 compatibility factors including personality traits, communication styles, life goals, and values. Unlike traditional dating apps that focus primarily on appearance and location, our algorithm prioritizes deep compatibility for meaningful connections."
    },
    {
      question: "How is LoveQuest different from other dating apps?",
      answer: "LoveQuest focuses on quality over quantity. Our AI matching, stringent verification process, and meaningful conversation tools are designed to help you find genuine connections rather than endless swiping."
    },
    {
      question: "How does the verification process work?",
      answer: "Our multi-step verification includes photo verification, social media linking options, and optional ID verification for enhanced trust. This ensures you're only talking to real, authentic people."
    },
    {
      question: "Can I use LoveQuest for free?",
      answer: "Yes! Our free tier gives you access to basic features including profile creation, limited matches, and text messaging. Premium plans unlock advanced features for serious daters."
    },
    {
      question: "How private is my information?",
      answer: "We take privacy seriously. Your personal data is encrypted and never sold to third parties. You control exactly what information is visible on your profile and to whom."
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Find answers to common questions about LoveQuest
          </p>
        </div>
        
        <Accordion type="single" collapsible className="bg-white rounded-xl shadow-sm border border-love-100 overflow-hidden">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className={index > 0 ? 'border-t border-love-100' : ''}>
              <AccordionTrigger className="px-6 py-4 hover:bg-love-50/50">
                <span className="text-left font-medium">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 text-gray-700">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
