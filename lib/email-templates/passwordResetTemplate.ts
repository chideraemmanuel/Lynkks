interface Params {
  first_name: string | null;
  reset_page_path: string;
  email: string;
  reset_string: string;
}

const passwordResetTemplate = ({
  first_name,
  reset_page_path,
  email,
  reset_string,
}: Params) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Lynkks | Password Reset</title>

    <style>
      @font-face {
        font-family: 'GeistMonoVF';
        src: url('@/fonts/GeistMonoVF.woff');
      }
      @font-face {
        font-family: 'GeistVF';
        src: url('@/fonts/GeistVF.woff');
      }
      * {
        margin: 0;
        padding: 0;
        border-spacing: 0;
        box-sizing: border-box;
        font-family: 'GeistVF';
      }

      body {
        background-color: hsl(222.2 47.4% 11.2%);
      }

      .container {
        max-width: 658px;
        margin: 0 auto;
      }

      .body {
        background-color: #fff;
        width: 100%;
      }

      .main {
        background-color: #fff;
        color: #000000;
        display: block;
        padding: 48px;
      }

      a {
        text-decoration: none;
      }

      .button {
        margin-bottom: 40px;
        display: inline-block;
        padding: 19px 32px;
        color: #fff;
        background-color: hsl(222.2 47.4% 11.2%);
        font-weight: bold;
        font-size: 16px;
        line-height: 140%;
        letter-spacing: -1.44%;
        text-decoration: none;
      }

      .header {
        display: block;
        width: 100%;
        background-color: #f5f9f5;
        padding: 36px 48px;
      }

      .header__logo {
        color: #000000;
        font-weight: 600;
        font-size: 24px;
        line-height: 150%;
        letter-spacing: 0%;
        font-weight: bold;
        display: inline-block;
      }

      .main__icon {
        width: 56px;
        height: 56px;
      }
      .main__icon img {
        width: 100%;
        height: 100%;
      }
      .main__content--header {
        color: #000000;
        font-weight: 600;
        font-size: 20px;
        line-height: 150%;
        letter-spacing: 0%;
        font-weight: bold;
        display: block;
        padding-bottom: 40px;
      }
      .main__content--body {
        padding-bottom: 40px;
      }
      .main__content--body .greeting {
        display: inline-block;
        line-height: 180%;
        font-size: 16px;
        letter-spacing: 0%;
      }
      .main__content--body .text {
        line-height: 180%;
        font-size: 16px;
        letter-spacing: 0%;
      }
      .main__content--body strong {
        color: hsl(222.2 47.4% 11.2%);
        font-weight: 700;
      }
      .main__content--body .ordered-list {
        padding-left: 20px;
      }

      .footer {
        background-color: #f5f8ff;
        padding: 32px;
        color: #494747;
      }
      .footer__text--paragraph {
        display: block;
        padding-bottom: 24px;
        color: #343f54;
        font-size: 14px;
        line-height: 140%;
        letter-spacing: -1.44%;
      }
      .footer__text--paragraph a {
        color: hsl(222, 100%, 44%);
      }
      .footer__links {
        padding-top: 40px;
        padding-bottom: 35px;
      }
      .footer__links a {
        display: inline-block;
        margin-right: 24px;
      }
      .footer__links a:last-child {
        margin-right: 0;
      }
    </style>
  </head>
  <body>
    <center class="container">
      <table class="body">
        <!-- header -->
        <tr class="header">
          <td>
            <!-- <img src="../assets/logo.svg" alt="#" /> -->
            <span class="header__logo">Lynkks</span>
          </td>
        </tr>

        <!-- main content -->
        <tr class="main">
          <td class="">
            <div class="main__content">
              <h1 class="main__content--header">Password Reset Code</h1>

              <div class="main__content--body">
                <span class="greeting">Hey ${
                  first_name
                    ? `${first_name.charAt(0).toUpperCase()}${first_name.slice(
                        1
                      )}`
                    : 'there'
                },</span>
                <br />
                <br />
                <br />
                <p class="text">
                  We noticed you requested a password reset for your Lynkks
                  account. To reset your password, simply click on the reset
                  password button below.
                </p>
                <br />
                <br />
                <p class="text">
                  This link expires in 5 minutes. If you didn't request this
                  change, please ignore this email, and your password will
                  remain unchanged.
                </p>
                <br />
                <br />

                <p class="text">
                  Best regards,
                  <br />
                  Chidera, Lynkks Founder.
                </p>
              </div>

              <a href="${
                process.env.CLIENT_BASE_URL
              }${reset_page_path}?email=${encodeURIComponent(
    email
  )}reset_string=${reset_string}"
              class="main__content--button button">Reset password</a>
            </div>

            <!-- footer -->
            <div class="footer">
              <div class="footer__text">
                <p class="footer__text--paragraph">
                  Need help?
                  <a href="mailto:thechideraemmanuel@gmail.com"
                    >Contact our support team</a
                  >. Want to give us feedback? Let us know what you think via
                  <a href="#">email</a>.
                </p>
              </div>

              <div class="footer__links">
                <a href="#">
                  <img src="../assets/facebook-icon.png" alt="facebook" />
                </a>
                <a href="#">
                  <img src="../assets/linkedin-icon.png" alt="linkedin" />
                </a>
                <a href="#">
                  <img src="../assets/twitter-icon.png" alt="twitter" />
                </a>
                <a href="#">
                  <img src="../assets/instagram-icon.png" alt="instagram" />
                </a>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>
    `;
};

export default passwordResetTemplate;
