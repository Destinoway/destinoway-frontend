import FooterBottom from "./footer/FooterBottom";
import FooterLinks from "./footer/FooterLinks";

export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="footer-backgound-color px-10 pt-10"
    >
      <FooterLinks />
      <FooterBottom />
    </footer>
  );
}
