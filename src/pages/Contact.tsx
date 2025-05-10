
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define contact form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Contact form submitted:", values);
      
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We will get back to you soon.",
        duration: 5000,
      });
      
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Mail className="h-8 w-8 mr-2 text-blue-600" />
        <h1 className="text-3xl font-bold">Contact Us</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div>
          <h2 className="text-xl font-semibold mb-4">Get In Touch</h2>
          <p className="mb-6 text-gray-600">
            Have questions about flood risks in your area? Want to contribute data or volunteer? 
            Or need more information about our flood monitoring system? 
            Feel free to reach out to us using the contact form or through any of the channels listed below.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-3 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">Email Us</h3>
                <p className="text-gray-600">info@indiafloodvision.org</p>
                <p className="text-gray-600">support@indiafloodvision.org (for technical support)</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-3 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">Call Us</h3>
                <p className="text-gray-600">General Inquiries: +91-11-2345-6789</p>
                <p className="text-gray-600">24/7 Support Line: +91-11-2345-6780</p>
                <p className="text-sm text-gray-500 mt-1">
                  Note: For emergencies, please use the Emergency Reporting section or call 112
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium">Visit Us</h3>
                <p className="text-gray-600">
                  India Flood Vision<br />
                  4th Floor, Hydrology Building<br />
                  Science Complex, Lodhi Road<br />
                  New Delhi, 110003
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="What is your message about?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Type your message here..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
