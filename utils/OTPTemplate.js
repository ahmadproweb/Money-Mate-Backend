const OTPTemplate = (email, otpCode, purpose = "Authentication Code") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${purpose}</title>
  <style>
    /* Prevent dark mode from overriding background and text */
    @media (prefers-color-scheme: dark) {
      body, table, td {
        background-color: #ffffff !important;
        color: #000000 !important;
      }
      .otp-box {
        background-color: #F0F4FF !important;
        color: #4A90E2 !important;
        border-color: #4A90E2 !important;
      }
      a {
        color: #4A90E2 !important;
      }
    }

    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        padding: 0 10px !important;
      }
      .otp-box {
        font-size: 24px !important;
        padding: 12px 24px !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;">
  <table width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f4;">
    <tr>
      <td style="padding:20px 0;">
        <table class="email-container" width="100%" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;" cellpadding="0" cellspacing="0">
        
          <tr>
            <td align="center" style="padding:20px;background-color:#4A90E2;color:#fff;">
              <h1 style="margin:0;font-size:24px;">${purpose}</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 30px;color:#333;background-color:#ffffff;">
              <p style="font-size:16px;">Hi <strong>${email}</strong>,</p>
              <p style="font-size:16px;line-height:1.5;margin:16px 0;">
                Use the code below to proceed with <strong>${purpose}</strong>:
              </p>
              <div style="text-align:center;padding:20px 0;">
                <span class="otp-box" style="
                  font-size:28px;
                  font-weight:bold;
                  color:#4A90E2;
                  padding:16px 40px;
                  background-color:#F0F4FF;
                  border:2px dashed #4A90E2;
                  border-radius:8px;
                  display:inline-block;
                ">${otpCode}</span>
              </div>
              <p style="font-size:16px;line-height:1.5;margin:16px 0;">
                Didn’t request this? You can ignore it or 
                <a href="mailto:contact@ahmadproweb.com" style="color:#4A90E2;text-decoration:underline;">contact support</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 30px;color:#999;font-size:14px;line-height:1.5;background-color:#ffffff;">
              <p style="margin:16px 0;">Thanks for using <strong>Money Mate</strong> 💰</p>
              <p style="margin:0;font-size:12px;color:#aaa;">&copy; 2025 Money Mate. All rights reserved.</p>
            </td>
          </tr>

<!-- Developer Info -->
<div style="margin-top: 30px; text-align: center; font-size: 14px; color: #555;">
  <p style="margin: 10px 0;">
    <strong>💼 Open for work:</strong> freelance, consulting, or collaboration.
  </p>

  <div style="margin-top: 10px;">
    <a href="https://www.fiverr.com/ahmad_pro_web" target="_blank" style="margin: 0 6px;">
      <img src="https://api.moneymate.ahmadproweb.com/icons/fiver.png" width="24" height="24" alt="Fiverr" />
    </a>
    <a href="https://ahmadproweb.com" target="_blank" style="margin: 0 6px;">
      <img src="https://api.moneymate.ahmadproweb.com/icons/web.png" width="24" height="24" alt="Portfolio" />
    </a>
    <a href="mailto:contact@ahmadproweb.com" target="_blank" style="margin: 0 6px;">
      <img src="https://api.moneymate.ahmadproweb.com/icons/email.png" width="24" height="24" alt="Email" />
    </a>
    <a href="https://github.com/ahmadproweb" target="_blank" style="margin: 0 6px;">
      <img src="https://api.moneymate.ahmadproweb.com/icons/github.png" width="24" height="24" alt="GitHub" />
    </a>
    <a href="https://linkedin.com/in/ahmadproweb" target="_blank" style="margin: 0 6px;">
      <img src="https://api.moneymate.ahmadproweb.com/icons/linkedin.png" width="24" height="24" alt="LinkedIn" />
    </a>
    <a href="https://wa.me/+923106082642" target="_blank" style="margin: 0 6px;">
      <img src="https://api.moneymate.ahmadproweb.com/icons/whatsapp.png" width="24" height="24" alt="WhatsApp" />
    </a>
    <a href="https://instagram.com/ahmadproweb" target="_blank" style="margin: 0 6px;">
      <img src="https://api.moneymate.ahmadproweb.com/icons/instagram.png" width="24" height="24" alt="Instagram" />
    </a>
    <a href="https://facebook.com/ahmadprowebofficial" target="_blank" style="margin: 0 6px;">
      <img src="https://api.moneymate.ahmadproweb.com/icons/facebook.png" width="24" height="24" alt="Facebook" />
    </a>
  </div>
</div>


        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = OTPTemplate;
