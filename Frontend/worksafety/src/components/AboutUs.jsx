import { useNavigate } from "react-router-dom"
import { FaLinkedin } from "react-icons/fa"
import AppLayout from "./Layouts/AppLayout"

const AboutUs = () => {
  const navigate = useNavigate()

  const teamMembers = [
    { name: "Shrivarsha", role: "RVCE", image: "/shrivarsha.jpg", linkedin: "https://in.linkedin.com/in/shrivarsha-poojary-960691249" },
    { name: "Ravikiran Aithal", role: "RVCE", image: "/ravi.jpg", linkedin: "https://www.linkedin.com/in/ravikiran-aithal-76674519b/" },
    { name: "K Keerthan Kini", role: "RVCE", image: "/keerthan.jpg", linkedin: "https://www.linkedin.com/in/k-keerthan-kini-040979284" },
    { name: "Shiva Kumar", role: "RVCE", image: "/shiva.jpg", linkedin: "https://www.linkedin.com/in/shiva-kumar-35077425b/" },
    { name: "D Amogh Karanth", role: "RVCE", image: "/amogh.jpg", linkedin: "https://www.linkedin.com/in/amogh-karanth-aa951825b/" },
  ]

  return (
    <AppLayout>
    <div className="bg-base-200 py-16 px-4 mt-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About ClearZone AI</h1>
          <p className="mx-auto max-w-3xl text-lg opacity-90">
            Empowering the future of workplace safety through innovative AI solutions.
          </p>
        </div>

        {/* Team Members Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card bg-base-100 shadow-xl w-80 flex flex-col items-center text-center p-6">
                <figure className="flex justify-center items-center w-fullp-2">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="rounded-full h-52 w-52 object-cover object-top    "
                  />
                </figure>
                <div className="card-body items-center text-center mt-4">
                  <h3 className="card-title text-lg font-semibold">{member.name}</h3>
                  <p className="opacity-70">{member.role}</p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 flex items-center gap-2 mt-2"
                  >
                    <FaLinkedin size={24} /> LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="card bg-base-100 shadow-xl mx-auto w-full md:w-3/4 lg:w-2/3">
          <div className="card-body p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="opacity-90">
              At ClearZone AI, we're committed to revolutionizing workplace safety through cutting-edge AI technology.
              Our mission is to create safer, more efficient work environments by providing intelligent, real-time
              monitoring and alert systems that protect employees and assets.
            </p>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  )
}

export default AboutUs
