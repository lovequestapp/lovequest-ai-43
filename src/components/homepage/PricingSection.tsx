
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link } from 'react-router-dom';
import { Crown, Check, X, Star } from 'lucide-react';

const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const comparisonFeatures = [
    { name: "AI-Powered Matching", free: true, premium: true, vip: true },
    { name: "Verified Profiles", free: true, premium: true, vip: true },
    { name: "Daily Matches", free: "5/day", premium: "Unlimited", vip: "Unlimited" },
    { name: "Message Filters", free: false, premium: true, vip: true },
    { name: "Video Calling", free: false, premium: true, vip: true },
    { name: "See Who Likes You", free: false, premium: true, vip: true },
    { name: "Relationship Insights", free: false, premium: true, vip: true },
    { name: "Profile Boost", free: false, premium: "Once a month", vip: "Weekly" },
    { name: "Priority Support", free: false, premium: false, vip: true },
    { name: "Exclusive VIP Events", free: false, premium: false, vip: true },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-love-50 rounded-full mb-4">
            <Crown size={18} className="text-love-500 mr-2" />
            <span className="text-sm font-medium text-love-700">Membership Plans</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible options to match your dating goals
          </p>
          
          <div className="inline-flex items-center mt-6 bg-gray-100 p-1 rounded-full">
            <RadioGroup 
              value={billingPeriod} 
              onValueChange={setBillingPeriod} 
              className="flex"
            >
              <div className={`px-4 py-2 rounded-full cursor-pointer ${billingPeriod === 'monthly' ? 'bg-white shadow-sm' : ''}`}>
                <RadioGroupItem 
                  value="monthly" 
                  id="monthly" 
                  className="hidden"
                />
                <label htmlFor="monthly" className="cursor-pointer flex items-center">
                  Monthly
                </label>
              </div>
              <div className={`px-4 py-2 rounded-full cursor-pointer flex items-center ${billingPeriod === 'yearly' ? 'bg-white shadow-sm' : ''}`}>
                <RadioGroupItem 
                  value="yearly" 
                  id="yearly" 
                  className="hidden"
                />
                <label htmlFor="yearly" className="cursor-pointer flex items-center">
                  Yearly
                  <Badge className="ml-2 bg-love-500">Save 20%</Badge>
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-love-100 shadow-md hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-2xl font-display font-bold mb-2">Free</h3>
              <p className="text-3xl font-bold mb-4">$0<span className="text-lg font-normal text-gray-500">/month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Basic profile creation
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Limited matches per day
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Text messaging
                </li>
                <li className="flex items-center text-gray-400">
                  <X size={16} className="text-gray-300 mr-2" />
                  See who likes you
                </li>
                <li className="flex items-center text-gray-400">
                  <X size={16} className="text-gray-300 mr-2" />
                  Video calls
                </li>
              </ul>
              <Link to="/signup" className="block">
                <Button variant="outline" className="w-full border-love-200">Sign Up Free</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-love-500 shadow-xl hover:-translate-y-2 transition-all duration-300 relative">
            <Badge 
              variant="success" 
              className="absolute top-2 right-2 px-2 py-1 text-xs font-medium flex items-center gap-1"
            >
              <Star size={12} className="text-green-700" />
              Most Popular
            </Badge>
            <CardContent className="p-6">
              <h3 className="text-2xl font-display font-bold mb-2">Premium</h3>
              <p className="text-3xl font-bold mb-4">
                ${billingPeriod === 'monthly' ? '9.99' : '7.99'}
                <span className="text-lg font-normal text-gray-500">/month</span>
              </p>
              {billingPeriod === 'yearly' && (
                <p className="text-sm text-love-600 mb-4">Billed annually (${(7.99 * 12).toFixed(2)})</p>
              )}
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Unlimited matches
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Voice notes & Video calling
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Priority in search results
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  See who liked you
                </li>
                <li className="flex items-center text-gray-400">
                  <X size={16} className="text-gray-300 mr-2" />
                  Profile boost weekly
                </li>
              </ul>
              <Link to="/signup" className="block">
                <Button className="w-full bg-love-500 hover:bg-love-600">Get Premium</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-love-100 shadow-md hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-2xl font-display font-bold mb-2">VIP</h3>
              <p className="text-3xl font-bold mb-4">
                ${billingPeriod === 'monthly' ? '19.99' : '15.99'}
                <span className="text-lg font-normal text-gray-500">/month</span>
              </p>
              {billingPeriod === 'yearly' && (
                <p className="text-sm text-love-600 mb-4">Billed annually (${(15.99 * 12).toFixed(2)})</p>
              )}
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  All Premium features
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Profile boost once a week
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Unlimited gifts
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Exclusive VIP badge
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Priority support
                </li>
              </ul>
              <Link to="/signup" className="block">
                <Button variant="outline" className="w-full border-love-200 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 text-love-700">Go VIP</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        {/* Feature Comparison Table */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-love-100 overflow-hidden">
          <div className="px-6 py-4 bg-love-50">
            <h3 className="text-xl font-semibold">Feature Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-love-100">
                  <th className="text-left p-4">Feature</th>
                  <th className="p-4 text-center">Free</th>
                  <th className="p-4 text-center bg-love-50">Premium</th>
                  <th className="p-4 text-center">VIP</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-4 font-medium">{feature.name}</td>
                    <td className="p-4 text-center">
                      {typeof feature.free === 'boolean' ? 
                        (feature.free ? <Check size={18} className="mx-auto text-green-500" /> : 
                        <X size={18} className="mx-auto text-gray-300" />) : 
                        feature.free}
                    </td>
                    <td className="p-4 text-center bg-love-50/50">
                      {typeof feature.premium === 'boolean' ? 
                        (feature.premium ? <Check size={18} className="mx-auto text-green-500" /> : 
                        <X size={18} className="mx-auto text-gray-300" />) : 
                        feature.premium}
                    </td>
                    <td className="p-4 text-center">
                      {typeof feature.vip === 'boolean' ? 
                        (feature.vip ? <Check size={18} className="mx-auto text-green-500" /> : 
                        <X size={18} className="mx-auto text-gray-300" />) : 
                        feature.vip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
