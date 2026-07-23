import React from 'react';
import { Linkedin, Github, MessageCircle, Instagram, Mail, Phone } from 'lucide-react';

export default function ProfileCard() {
  return (
    <aside className="w-full max-w-sm bg-[#faf8f5] text-[#1a1612] border border-[#a88c6d]/20 rounded-[24px] p-8 flex flex-col items-center text-center shadow-lg sticky top-[100px]">
      {/* Profile Image with clean professional rounded rectangle */}
      <div className="w-[180px] h-[220px] rounded-2xl overflow-hidden mb-5 border-3 border-[#a88c6d]/25 shadow-xl bg-white flex items-center justify-center">
        <img 
          src="../images/creator_profile.png" 
          alt="Shubham Yadav" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name and Title */}
      <h2 className="font-serif text-3xl font-extrabold tracking-tight mb-1">
        Shubham Yadav
      </h2>
      <div className="font-sans font-bold text-xs text-[#a88c6d] uppercase tracking-[0.08em] mb-4">
        3RD YEAR IT STUDENT & CLOUD ARCHITECT
      </div>

      {/* Short Bio */}
      <p className="text-[13px] text-[#4a443e] leading-relaxed mb-6 max-w-[280px]">
        B.Tech IT student at KIET (CGPA: 7.53). Passionate about Full-Stack Development, AWS Cloud, and DSA.
      </p>

      {/* Action Rows / Social Links */}
      <div className="flex justify-center gap-3 mb-6">
        <a 
          href="https://linkedin.com/in/shubham-yadav2931/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full border border-[#a88c6d]/30 bg-white flex items-center justify-center hover:bg-[#a88c6d] hover:text-white hover:border-[#a88c6d] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          title="LinkedIn"
        >
          <Linkedin size={18} />
        </a>
        <a 
          href="https://github.com/yaadvshubham" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full border border-[#a88c6d]/30 bg-white flex items-center justify-center hover:bg-[#a88c6d] hover:text-white hover:border-[#a88c6d] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          title="GitHub"
        >
          <Github size={18} />
        </a>
        <a 
          href="https://wa.me/918860841336" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full border border-[#a88c6d]/30 bg-white flex items-center justify-center hover:bg-[#a88c6d] hover:text-white hover:border-[#a88c6d] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          title="WhatsApp"
        >
          <MessageCircle size={18} />
        </a>
        <a 
          href="https://instagram.com/yaadv_shubham" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full border border-[#a88c6d]/30 bg-white flex items-center justify-center hover:bg-[#a88c6d] hover:text-white hover:border-[#a88c6d] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          title="Instagram"
        >
          <Instagram size={18} />
        </a>
      </div>

      {/* Contact Details List */}
      <div className="w-full text-left border-t border-[#a88c6d]/20 pt-5 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-[13px] text-[#1a1612]">
          <Mail size={16} className="text-[#a88c6d] shrink-0" />
          <a href="mailto:yaadvshubham01@gmail.com" className="font-medium hover:text-[#a88c6d] transition-colors duration-150">
            yaadvshubham01@gmail.com
          </a>
        </div>
        <div className="flex items-center gap-3 text-[13px] text-[#1a1612]">
          <Phone size={16} className="text-[#a88c6d] shrink-0" />
          <a href="tel:+918860841336" className="font-medium hover:text-[#a88c6d] transition-colors duration-150">
            +91-8860841336
          </a>
        </div>
      </div>
    </aside>
  );
}
