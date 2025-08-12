import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
const Products = () => {

  const navigate=useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   if (location.hash) {
  //     const target = document.querySelector(location.hash);
  //     if (target) {
  //       target.scrollIntoView({ behavior: 'smooth' });
  //     }
  //   }
  // }, [location]);


  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        // Calculate the position with offset
        const headerOffset = 100; // Adjust offset as needed
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        // Smooth scroll to the calculated position
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  }, [location]);
 

  return (
    <div className="bg-base-200 py-16 px-4">
      {/* Partner Logos */}
      <div className="container mx-auto max-w-7xl">
        <div className="flex  justify-between gap-8 flex-wrap ">

          <img
            src="/partener1.png"
            alt="Partner logo 1"
            className="h-32 object-contain "
          />
          <img
            src="/bmw.png"
            alt="Partner logo 2"
            className="h-32 object-contain "
          />
          <img
            src="/benz.png"
            alt="Partner logo 3"
            className="h-32 object-contain "
          />
          <img
            src="/landrover.png"
            alt="Partner logo 3"
            className="h-32 object-contain "
          />
          <img
            src="/jaguar.svg"
            alt="Partner logo 3"
            className="h-32 object-contain "
          />

        </div>

        {/* Products Section */}
        <div className="mt-24 text-center">
          <h2 className="text-4xl font-bold">Our products</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg opacity-90">
            Whether it's automating site access, enforcing compliance, welcoming visitors or identifying safety issues, our
            products are designed to keep your workplace efficient, safe, and secure.
          </p>
        </div>

        {/* Product Cards */}
        <div className="mt-16 space-y-8">
          {/* AI Checkpoints Card */}
          <div className="card bg-base-100 shadow-xl" id='solution1'>
            <div className="card-body p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="badge badge-primary">Safety First, Always Enforced</div>
                  <h3 className="text-2xl font-bold">Real-Time PPE Monitoring for Workplace Safety</h3>
                  <p className="opacity-90">
                  ClearZone AI ensures strict adherence to PPE compliance by monitoring employees in real-time. The system identifies instances of missing safety gear and instantly alerts supervisors, minimizing risks and enhancing workplace safety.
                  </p>
                  <button className="btn btn-outline"
                    onClick={()=>navigate('/dashboard/ppe1-ppe2')}
                  
                  >Learn more</button>
                </div>
                <div className="relative">
                  <img
                    src="/helmet.png"
                    alt="Blue truck with access notification"
                    className="rounded-lg object-cover w-full"
                  />
                  
                </div>
              </div>
            </div>
          </div>

        
          <div className="card bg-base-100 shadow-xl" id='solution2'>
            <div className="card-body p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="relative order-2 md:order-1">
                  <img
                    src="/product2.png"
                    alt="Person wearing safety helmet"
                    className="rounded-4xl object-cover w-full  "
                  />
                </div>
                <div className="space-y-4 order-1 md:order-2">
                  <div className="badge badge-primary">Guiding You to Safety, When It Matters Most</div>
                  <h3 className="text-2xl font-bold">AI-Driven Evacuation Assistance for Factories</h3>
                  <p className="opacity-90">
                  ClearZone AI revolutionizes emergency management with smart evacuation solutions. By leveraging real-time monitoring and advanced analytics, the system identifies potential hazards, guides employees to safety, and ensures swift evacuations during emergencies.
                  </p>
                  <button className="btn btn-outline"
                    onClick={()=>navigate('/dashboard/missing')}
                  >Learn more</button>
                </div>
              </div>
            </div>
          </div>

          {/* third */}



          <div className="card bg-base-100 shadow-xl"  id='solution3'>
            <div className="card-body p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="badge badge-primary">Detect Spills, Prevent Hazards</div>
                  <h3 className="text-2xl font-bold">Spill Detection and Instant Alerts for Factory Safety</h3>
                  <p className="opacity-90">
                  ClearZone AI enhances workplace safety by monitoring for spills in real-time. The system identifies unattended spills, promptly alerts supervisors, and helps prevent accidents, ensuring a cleaner and safer work environment.
                  </p>
                  <button className="btn btn-outline"
                   onClick={()=>navigate('/dashboard/spill')}
                  >Learn more</button>
                </div>
                <div className="relative">
                  <img
                    src="/spill.png"
                    alt="Blue truck with access notification"
                    className="rounded-lg object-cover w-full"
                  />

                </div>
              </div>
            </div>
          </div>
    

    {/* Fourth */}


    <div className="card bg-base-100 shadow-xl"  id='solution4'>
            <div className="card-body p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="relative order-2 md:order-1">
                  <img
                    src="/fall.png"
                    alt="Person wearing safety helmet"
                    className="rounded-4xl object-cover w-full  "
                  />
                </div>
                <div className="space-y-4 order-1 md:order-2">
                  <div className="badge badge-primary">Instant Alerts, Swift Response</div>
                  <h3 className="text-2xl font-bold"> Fall Detection Alerts for Employee Safety</h3>
                  <p className="opacity-90">
                  ClearZone AI ensures rapid response to workplace incidents with its fall detection technology. The system immediately identifies when an employee falls and sends instant alerts to supervisors, reducing response time and enhancing safety measures.
                  </p>
                  <button className="btn btn-outline"
                    onClick={()=>navigate('/dashboard/fall')}
                  
                  >Learn more</button>
                </div>
              </div>
            </div>
          </div>







  {/* fifth */}

  <div className="card bg-base-100 shadow-xl"  id='solution5'>
            <div className="card-body p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="badge badge-primary">Signal Danger, Ensure Safety</div>
                  <h3 className="text-2xl font-bold">Gesture-Based Emergency Alerts for Quick Hazard Response</h3>
                  <p className="opacity-90">
                  ClearZone AI empowers employees to signal emergencies with simple gestures. The system recognizes these gestures in real-time and broadcasts alerts to all relevant personnel, ensuring swift action during critical situations.
                  </p>
                  <button className="btn btn-outline"
                  onClick={()=>navigate('/dashboard/mask-ppe1')}
                  >Learn more</button>
                </div>
                <div className="relative">
                  <img
                    src="/gesture.png"
                    alt="Blue truck with access notification"
                    className="rounded-lg object-cover w-full"
                  />

                </div>
              </div>
            </div>
          </div>



          {/* sixth */} 
          <div className="card bg-base-100 shadow-xl"  id='solution6'>
            <div className="card-body p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="relative order-2 md:order-1">
                  <img
                    src="/climb.png"  
                    alt="Person wearing safety helmet"
                    className="rounded-4xl object-cover w-full  "
                  />
                </div>
                <div className="space-y-4 order-1 md:order-2">
                  <div className="badge badge-primary">Detect Risks, Secure Spaces</div>
                  <h3 className="text-2xl font-bold">Climbing Detection: Prevent Hazards Before They Happen</h3>
                  <p className="opacity-90">
                  ClearZone AI keeps your workplace safe by detecting unauthorized climbing in real-time. The system instantly alerts supervisors to potential safety risks, ensuring proactive responses and protecting employees from hazardous situations.
                  </p>
                  <button className="btn btn-outline"
                    onClick={()=>navigate('/dashboard/climb')}
                  >Learn more</button>
                </div>
              </div>
            </div>
          </div>












          <div className="card bg-base-100 shadow-xl"  id='solution5'>
            <div className="card-body p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="badge badge-primary"> Detect Fire, Act Fast</div>
                  <h3 className="text-2xl font-bold">AI-Powered Fire Alerts for Immediate Response</h3>
                  <p className="opacity-90">
                  ClearZone AI instantly detects flames and fire using advanced AI models. The system identifies fire outbreaks in real-time and triggers immediate alerts to all relevant personnel, ensuring a swift response to prevent escalation and damage.
                  </p>
                  <button className="btn btn-outline"
                  onClick={()=>navigate('/dashboard/fire')}
                  >Learn more</button>
                </div>
                <div className="relative">
                  <img
                    src="/fire.png"
                    alt="Blue truck with access notification"
                    className="rounded-lg object-cover w-full"
                  />

                </div>
              </div>
            </div>
          </div>













          <div className="card bg-base-100 shadow-xl"  id='solution6'>
            <div className="card-body p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="relative order-2 md:order-1">
                  <img
                    src="/speed.png"  
                    alt="forklift"
                    className="rounded-4xl object-cover w-full  "
                  />
                </div>
                <div className="space-y-4 order-1 md:order-2">
                  <div className="badge badge-primary"> Control Speed, Ensure Safety </div>
                  <h3 className="text-2xl font-bold">ClearZone AI Overspeed Alerts for Forklift Safety</h3>
                  <p className="opacity-90">
                  ClearZone AI monitors forklift speed in real-time to prevent accidents in factory environments. The system detects overspeeding forklifts and triggers instant alerts to operators and safety personnel, ensuring compliance with safety protocols and reducing workplace hazards.
                  </p>
                  <button className="btn btn-outline"
                    onClick={()=>navigate('/dashboard/speed')}
                  >Learn more</button>
                </div>
              </div>
            </div>
          </div>

















        </div>
      </div>
    </div>
  )
}

export default Products
