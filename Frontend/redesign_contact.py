with open('base_header.txt', 'r', encoding='utf-8') as f:
    header = f.read()

with open('base_footer.txt', 'r', encoding='utf-8') as f:
    footer = f.read()

contact_header = header.replace('<title>E-Bazaar | New Arrivals</title>', '<title>E-Bazaar | Contact Us</title>').replace('data-page="category"', 'data-page="static"')

contact_main = '''
<main class="page-main">
  <div class="breadcrumb" aria-label="Breadcrumb">
    <a href="index.html">Home</a><span aria-hidden="true">&rsaquo;</span><span aria-current="page">Contact Us</span>
  </div>
  
  <section class="section" style="max-width: 1100px; margin: 0 auto; padding-top: 20px;">
    
    <div style="text-align: center; margin-bottom: 48px;">
      <h1 style="font-size: 42px; font-weight: 800; background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 16px;">We'd love to hear from you</h1>
      <p style="color: var(--text-muted); font-size: 18px; max-width: 600px; margin: 0 auto;">Whether you have a question about an order, need styling advice, or want to file a complaint, our premium support team is ready to help.</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px; align-items: start;">
      
      <!-- Contact Info Cards -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="background: var(--bg-white); border-radius: var(--r-lg); padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid var(--border); transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 15px 35px rgba(0,0,0,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.05)';">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--accent-tint); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </div>
          <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Call Support</h3>
          <p style="color: var(--text-muted); font-size: 15px; margin-bottom: 16px;">Available Monday to Saturday, 9am - 7pm IST.</p>
          <p style="font-size: 18px; font-weight: 700; color: var(--accent);">1800-123-4567</p>
        </div>

        <div style="background: var(--bg-white); border-radius: var(--r-lg); padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid var(--border); transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 15px 35px rgba(0,0,0,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.05)';">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--accent-tint); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
          <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Email Support</h3>
          <p style="color: var(--text-muted); font-size: 15px; margin-bottom: 16px;">Send us an email and we'll reply within 24 hours.</p>
          <p style="font-size: 16px; font-weight: 600; color: var(--text);">support@e-bazaar.com</p>
        </div>
      </div>

      <!-- Premium Form -->
      <div style="background: var(--bg-white); border-radius: var(--r-lg); padding: 40px; box-shadow: 0 15px 40px rgba(0,0,0,0.08); border: 1px solid var(--border); position: relative; overflow: hidden;">
        <!-- Decorative bg blur -->
        <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: var(--accent); filter: blur(80px); opacity: 0.1; border-radius: 50%; pointer-events: none;"></div>
        
        <h2 style="font-size: 26px; font-weight: 800; margin-bottom: 24px; color: var(--text);">Send a Message</h2>
        
        <form id="contact-form" onsubmit="event.preventDefault(); alert('Your message has been received! Our support team will contact you within 24 hours.'); this.reset();">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="position: relative;">
              <label for="c-name" style="display: block; font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">First Name</label>
              <input type="text" id="c-name" required style="width: 100%; padding: 14px 16px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-alt); font-size: 15px; color: var(--text); outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
            </div>
            <div style="position: relative;">
              <label for="c-lname" style="display: block; font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Last Name</label>
              <input type="text" id="c-lname" style="width: 100%; padding: 14px 16px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-alt); font-size: 15px; color: var(--text); outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
            </div>
          </div>
          
          <div style="position: relative; margin-bottom: 20px;">
            <label for="c-email" style="display: block; font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</label>
            <input type="email" id="c-email" required style="width: 100%; padding: 14px 16px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-alt); font-size: 15px; color: var(--text); outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
          </div>
          
          <div style="position: relative; margin-bottom: 20px;">
            <label for="c-type" style="display: block; font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">How can we help?</label>
            <select id="c-type" required style="width: 100%; padding: 14px 16px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-alt); font-size: 15px; color: var(--text); outline: none; appearance: none; cursor: pointer; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
              <option value="" disabled selected>Select an option...</option>
              <option value="complaint">File a Complaint</option>
              <option value="return">Return or Refund Status</option>
              <option value="delivery">Where is my order?</option>
              <option value="feedback">Product Feedback</option>
              <option value="other">Other Inquiry</option>
            </select>
            <!-- Custom dropdown arrow -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position: absolute; right: 16px; top: 40px; width: 16px; height: 16px; pointer-events: none; color: var(--text-muted);"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>

          <div style="position: relative; margin-bottom: 32px;">
            <label for="c-msg" style="display: block; font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Message</label>
            <textarea id="c-msg" rows="4" required placeholder="Tell us more about your issue..." style="width: 100%; padding: 14px 16px; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--bg-alt); font-size: 15px; color: var(--text); outline: none; resize: vertical; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'"></textarea>
          </div>

          <button type="submit" style="width: 100%; padding: 16px; border-radius: var(--r-md); border: none; background: var(--accent); color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px; transition: background 0.3s ease, transform 0.2s ease;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
            Send Message
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
      
    </div>
  </section>
</main>
'''

with open('contact.html', 'w', encoding='utf-8') as f:
    f.write(contact_header + contact_main + footer)

print('Redesigned contact.html')
