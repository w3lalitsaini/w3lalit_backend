import Contact from "../models/contact.model.js";

export const contactSubmit = async (req, res) => {
  try {
    const { name, email, phone, niche, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are required" });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      niche,
      subject: subject || niche || "General Inquiry",
      message,
    });
    await newContact.save();

    console.log("Contact Form Submission Saved:", {
      name,
      email,
      phone,
      niche,
      message,
    });

    res.status(200).json({
      message: "Message sent successfully! We will get back to you soon.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
