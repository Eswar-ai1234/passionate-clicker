import { Link } from "react-router-dom";
import "./Pages.css";

function Services() {
  const services = [
    {
      number: "01",
      title: "Wedding Photography",
      description:
        "Your wedding day is filled with moments that deserve to be remembered exactly as they felt. We capture genuine emotions, beautiful details, family moments and the little interactions that make your celebration unique.",
      features: [
        "Full Wedding Day Coverage",
        "Candid Photography",
        "Traditional Photography",
        "Couple Portraits",
        "Family & Guest Moments",
        "Wedding Details",
      ],
    },

    {
      number: "02",
      title: "Pre-Wedding",
      description:
        "Your pre-wedding session should feel like your story. We create relaxed and cinematic photographs around your personality, connection and the places that mean something to you.",
      features: [
        "Location Planning",
        "Creative Concept",
        "Couple Portraits",
        "Cinematic Photography",
        "Professional Editing",
        "Online Gallery",
      ],
    },

    {
      number: "03",
      title: "Portrait Photography",
      description:
        "Whether it is a personal portrait session, professional profile or creative shoot, we focus on natural expressions, thoughtful compositions and images that represent you beautifully.",
      features: [
        "Individual Portraits",
        "Professional Headshots",
        "Creative Portrait Sessions",
        "Studio & Outdoor Shoots",
        "Professional Retouching",
        "High Resolution Images",
      ],
    },

    {
      number: "04",
      title: "Events",
      description:
        "From intimate celebrations to large events, we document the atmosphere, people and important moments so you can relive the experience long after the event is over.",
      features: [
        "Birthday Photography",
        "Engagements",
        "Corporate Events",
        "Private Celebrations",
        "Candid Event Coverage",
        "Complete Edited Gallery",
      ],
    },

    {
      number: "05",
      title: "Cinematography",
      description:
        "Photography freezes a moment. Film brings it back to life. Our cinematic films combine movement, emotion, music and storytelling to create something you can experience again and again.",
      features: [
        "Wedding Films",
        "Pre-Wedding Films",
        "Event Highlights",
        "Cinematic Storytelling",
        "Professional Color Grading",
        "Highlight Film",
      ],
    },

    {
      number: "06",
      title: "Product Photography",
      description:
        "Great product photography helps people understand your brand before they even read about it. We create clean, creative and professional visuals designed for websites, social media and marketing.",
      features: [
        "Product Catalog Images",
        "Creative Product Shots",
        "Social Media Content",
        "Brand Photography",
        "Professional Editing",
        "High Resolution Delivery",
      ],
    },
  ];

  return (
    <div className="page">

      {/* HERO */}

      <section className="page-hero">

        <p>WHAT WE OFFER</p>

        <h1>
          Crafted for
          <br />
          <span>your story.</span>
        </h1>

        <p className="page-description">
          From intimate portraits to unforgettable weddings,
          we create visual stories that feel authentic.
        </p>

      </section>


      {/* SERVICES */}

      <section className="services-page">

        {services.map((service) => (
          <article
            className="service-detail"
            key={service.number}
          >

            <div className="service-detail-number">
              {service.number}
            </div>

            <div className="service-detail-main">

              <p className="section-label">
                {service.number} / SERVICE
              </p>

              <h2>
                {service.title}
              </h2>

              <p className="service-detail-description">
                {service.description}
              </p>


              <div className="service-features">

                {service.features.map((feature) => (
                  <div
                    className="service-feature"
                    key={feature}
                  >
                    <span>✓</span>
                    <p>{feature}</p>
                  </div>
                ))}

              </div>


              <Link
                to="/contact"
                className="primary-btn"
              >
                Book This Service →
              </Link>

            </div>

          </article>
        ))}

      </section>

    </div>
  );
}

export default Services;