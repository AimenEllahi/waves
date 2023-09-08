import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({
  toggleActions: "restart pause resume pause",
  scroller: ".container",
});
const button = document.querySelector(".top-button");
// Select the element you want to scroll to by its id
const targetElement = document.getElementById("formSection");

button.addEventListener("click", () => {
  // Scroll to the bottom of the page
  window.scrollTo(0, 1000);

  // Scroll to the selected element
  targetElement.scrollIntoView({
    behavior: "smooth", // This makes the scroll animation smooth
    block: "start", // This aligns the top of the element with the top of the viewport
    inline: "nearest", // This determines how inline-level elements are aligned
  });
});

gsap.to(".red", {
  scrollTrigger: {
    trigger: ".red",
    toggleActions: "restart pause reverse pause",
  },

  backgroundColor: "#FFA500",
  ease: "power.inOut",
});

// Function to send the email
function sendMail(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the form element
  const form = document.getElementById("musicSubmissionForm");

  // Send the email using EmailJS
  emailjs.sendForm("service_o228z4m", "template_0p7yrhp", form).then(
    function (response) {
      console.log("Email sent successfully:", response);
      // You can add a success message or redirect to a thank you page here
      alert("Thank you! Your music submission has been sent successfully.");
    },
    function (error) {
      console.error("Email send failed:", error);
      // Handle the error, e.g., display an error message to the user
      alert("Oops! Something went wrong. Please try again later.");
    }
  );

  // Clear the form fields after submission if needed
  form.reset();
}

// Attach the sendMail function to the form's submit event
document
  .getElementById("musicSubmissionForm")
  .addEventListener("submit", sendMail);
