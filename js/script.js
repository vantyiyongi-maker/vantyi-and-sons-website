document.addEventListener("DOMContentLoaded", function () {
  // Mobile navigation
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-wrap");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Current copyright year
  document.querySelectorAll(".year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Enquiry form: validate and show a topic-specific response.
  const enquiryForm = document.getElementById("enquiry-form");
  const enquiryStatus = document.getElementById("form-status");
  if (enquiryForm && enquiryStatus) {
    enquiryForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!enquiryForm.reportValidity()) return;

      const name = enquiryForm.elements.fullName.value.trim();
      const topic = enquiryForm.elements.topic.value;
      const responses = {
        funeral: "Funeral arrangements and costs depend on the services selected. Please use the Contact Us form so the team can discuss your requirements.",
        services: "Service availability and costs must be confirmed by Vantyi & Sons. Please send your details through the Contact Us form.",
        products: "Product options, prices and availability need to be confirmed by the parlour. Please use the Contact Us form to send your request.",
        policies: "Policy benefits, premiums and eligibility depend on the policy terms. Please contact the organisation for accurate information.",
        repatriation: "Availability and costs depend on the route and arrangements required. Please email the organisation using the Contact Us form.",
        volunteer: "Thank you for your interest in volunteering. Please contact the organisation to ask whether volunteer opportunities are available.",
        sponsor: "Thank you for your interest in sponsorship. Please contact the organisation to discuss possible opportunities.",
        other: "Your enquiry form has been validated. Please use the Contact Us form to email your request to Vantyi & Sons."
      };
      enquiryStatus.textContent = "Thank you, " + name + ". " + responses[topic];
      enquiryStatus.style.display = "block";
      enquiryStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
      enquiryForm.reset();
    });
  }

  // Contact form: send the validated message to the configured recipient.
  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-status");
  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const button = contactForm.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = "Sending...";
      contactStatus.style.display = "block";
      contactStatus.textContent = "Your message is being sent. Please wait.";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { "Accept": "application/json" }
        });
        const result = await response.json();
        if (response.ok && (result.success === true || result.success === "true")) {
          contactStatus.textContent = "Thank you. Your message has been sent to Vantyi & Sons. The organisation can reply using the email address you provided.";
          contactForm.reset();
        } else {
          throw new Error("Email service did not accept the message.");
        }
      } catch (error) {
        contactStatus.textContent = "Sorry, your message could not be sent. Please check your internet connection and confirm that the recipient email has been activated with FormSubmit, then try again.";
      } finally {
        button.disabled = false;
        button.textContent = "Send message";
      }
    });
  }
});
