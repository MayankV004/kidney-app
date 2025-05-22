import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Mail, Phone, HelpCircle, AlertCircle, Info, Book, ArrowRight } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const resources = [
    {
      title: 'Understanding Kidney Disease',
      description: 'Learn about the different stages of kidney disease and what they mean for your health.',
      icon: <Info className="h-6 w-6 text-primary-500" />,
      link: '#',
    },
    {
      title: 'Nutrition Guidelines',
      description: 'Comprehensive guidelines for managing your diet with kidney disease.',
      icon: <Book className="h-6 w-6 text-primary-500" />,
      link: '#',
    },
    {
      title: 'Reading Food Labels',
      description: 'How to understand nutrition labels and make informed food choices.',
      icon: <AlertCircle className="h-6 w-6 text-primary-500" />,
      link: '#',
    },
    {
      title: 'Medication Management',
      description: 'Tips for managing medications and their interaction with your diet.',
      icon: <HelpCircle className="h-6 w-6 text-primary-500" />,
      link: '#',
    },
  ];

  const faqs = [
    {
      question: 'What is the DASH diet and is it good for kidney disease?',
      answer: 'The DASH (Dietary Approaches to Stop Hypertension) diet focuses on reducing sodium intake and increasing foods rich in nutrients that help lower blood pressure. While aspects of the DASH diet can be beneficial for some kidney patients, it may need to be modified depending on your kidney disease stage, as some DASH recommendations include foods high in potassium and phosphorus, which may need to be limited with advanced kidney disease.',
    },
    {
      question: 'How much protein should I eat with kidney disease?',
      answer: 'Protein needs vary depending on your kidney disease stage, body size, and overall health. In early stages, a normal protein intake (0.8g/kg body weight) is usually recommended. In later stages, your doctor may recommend a moderate protein restriction (0.6-0.8g/kg). Always consult with your healthcare provider or renal dietitian for personalized guidance.',
    },
    {
      question: 'Can I drink alcohol with kidney disease?',
      answer: 'Moderate alcohol consumption may be acceptable for some people with kidney disease, but it depends on your specific condition, medications, and overall health. Alcohol can dehydrate the body and interact with medications. Always discuss alcohol consumption with your healthcare provider.',
    },
    {
      question: 'What are phosphate binders and when should I take them?',
      answer: 'Phosphate binders are medications that help control phosphorus levels by binding to phosphorus in foods you eat, preventing it from being absorbed. They should be taken with meals and snacks as prescribed by your doctor. The timing is important - taking them 5-10 minutes before eating or with your first bite is typically recommended.',
    },
    {
      question: 'How can I reduce potassium in potatoes and other vegetables?',
      answer: 'To reduce potassium in potatoes and some vegetables, you can leach them: peel and cut into small pieces, soak in warm water for at least 2 hours, then drain and rinse before cooking in fresh water. Boiling vegetables in water (which is then discarded) can also help reduce potassium content.',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8 sm:px-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Help & Support
        </h1>
        <p className="text-neutral-600 mt-1">
          Resources and guidance to help you manage your kidney health
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
          Educational Resources
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {resources.map((resource, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full hover:shadow-elevation-3 transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="bg-primary-50 p-3 rounded-full w-fit mb-4">
                      {resource.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4 flex-grow">
                      {resource.description}
                    </p>
                    <a
                      href={resource.link}
                      className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center"
                    >
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-medium text-neutral-900">
                    {faq.question}
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-neutral-600">{faq.answer}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
          Contact Support
        </h2>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">
                  Get in Touch
                </h3>
                <p className="text-neutral-600 mb-6">
                  Our support team is here to help you with any questions or concerns about using the KidneyHealth platform.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-primary-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-neutral-900">Email</h4>
                      <a href="mailto:support@kidneyhealth.com" className="text-primary-500 hover:underline">
                        support@kidneyhealth.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-neutral-900">Phone</h4>
                      <a href="tel:+18005551234" className="text-primary-500 hover:underline">
                        (800) 555-1234
                      </a>
                      <p className="text-sm text-neutral-500">
                        Monday - Friday, 9am - 5pm EST
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">
                  Send a Message
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full rounded-md border border-neutral-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full rounded-md border border-neutral-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full rounded-md border border-neutral-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    ></textarea>
                  </div>
                  <Button variant="primary" fullWidth>
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};