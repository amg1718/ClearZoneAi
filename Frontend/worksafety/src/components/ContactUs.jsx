import { useState } from "react";
import { useRef } from "react";
import AppLayout from "./Layouts/AppLayout";
import emailjs from '@emailjs/browser';
const ContactUs = () => {
    const form = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_okq7qal', 'template_639vliw', form.current, {
        publicKey: 'h7ma3KDUemAnmp-G6',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          alert("Query Sent")
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert("Failed to send query")
        },
      );
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <AppLayout>
      <div className="bg-base-200 py-16 px-4 mt-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-8">Contact Us</h2>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-8">
              <form onSubmit={handleSubmit} ref={form} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-300"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 bg-indigo-600 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ContactUs;
