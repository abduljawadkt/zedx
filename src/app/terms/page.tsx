import type { Metadata } from "next";
import { InfoPage } from "@/components/content/InfoPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "ZEDX website, order, COD, exchange, warranty, and platform-use terms.",
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms & Conditions"
      description="These Terms of Use govern access to the ZEDX website, product browsing, COD orders, exchanges, warranties, and customer responsibilities."
      sections={[
        {
          title: "Use of the platform",
          body: (
            <>
              <p>
                This website is operated by ZEDX, referred to as &quot;ZEDX&quot;, &quot;Company&quot;, &quot;we&quot;, or &quot;our&quot;. You may access the site from a computer, mobile phone, or other device, and these Terms of Use govern your use of the site and your conduct regardless of the means of access.
              </p>
              <p>
                These Terms of Use govern all products offered on the site. The site is intended only for your personal, non-commercial use and information. Your use of the site and its features is governed by these Terms and Conditions together with the Privacy Policy, Shipping Policy, Delivery Policy, Refund Policy, and Return Policy, as modified or amended from time to time.
              </p>
              <p>
                By accessing, browsing, or otherwise using the site, you acknowledge without limitation or qualification that you are bound by these Terms of Use and the policies, whether or not you have read them.
              </p>
              <p>
                <strong>
                  Accessing, browsing, or otherwise using the site indicates your unconditional agreement to all terms and conditions in this agreement. Please read this agreement carefully before proceeding.
                </strong>
              </p>
              <p>
                Please do not use the site if you do not agree to any of the terms stated in these Terms of Use or the policies. You are responsible for ensuring that your access to this site and the material available on or through it is legal in each jurisdiction where you access, view, or use the site.
              </p>
            </>
          ),
        },
        {
          title: "Orders and cash on delivery",
          body: (
            <>
              <p>
                When placing an order, you agree to provide accurate and complete information, including your name, shipping address, and contact details.
              </p>
              <p>
                Orders will be processed only under the Cash on Delivery payment method unless ZEDX enables additional payment methods in the future. All current payments are strictly cash only.
              </p>
              <p>
                We reserve the right to refuse or cancel any order at our sole discretion, including but not limited to cases where a product is out of stock, pricing errors occur, incorrect information is displayed, or fraudulent activity is suspected.
              </p>
            </>
          ),
        },
        {
          title: "Intellectual property",
          body: (
            <>
              <p>
                ZEDX retains all rights, titles, and interests, including intellectual property rights, related to the website and platform, including but not limited to trademarks, designs, logos, copyrights, patents, trade secrets, URLs, domains, inventions, and other proprietary materials.
              </p>
              <p>
                These Terms do not grant any implied licenses or rights to our intellectual property. You may use the content only for personal purposes and must not use it for business or commercial purposes without permission.
              </p>
              <p>
                You must not alter or remove any copyright, trademark, service mark, or proprietary notices that are part of the platform. All current and future rights to trade secrets, copyrights, trademarks, and other proprietary materials in the platform remain exclusively with ZEDX.
              </p>
            </>
          ),
        },
        {
          title: "Product information",
          body: (
            <>
              <p>
                ZEDX attempts to be as accurate as possible in product descriptions on the site. However, ZEDX does not warrant that product descriptions, colors, information, images, specifications, or other site content are accurate, complete, reliable, current, or error-free.
              </p>
              <p>
                The site may contain typographical errors or inaccuracies and may not always be complete or current. Product pictures are indicative and may not match the actual product. In the event of inadvertent inaccuracies, ZEDX will endeavor to correct them within the earliest possible time period.
              </p>
            </>
          ),
        },
        {
          title: "Pricing and availability",
          body: (
            <>
              <p>
                ZEDX strives to provide accurate product and pricing information, but errors may occur. If a product is listed at an incorrect price or with incorrect information due to an inadvertent technical error, ZEDX may refuse or cancel orders placed for that product unless the product has already been delivered.
              </p>
              <p>
                If an item is wrongly priced, ZEDX may contact you for instructions or cancel your order and notify you of the cancellation.
              </p>
              <p>
                <strong>
                  Subject to these Terms and the policies, prices and availability of products provided or offered on the site are subject to change without prior notice and at the sole discretion of ZEDX.
                </strong>
              </p>
              <p>
                ZEDX may revise or cease to make available any product or service at any time. If ZEDX is unable to deliver a product on time or at all, you may be notified by email and the order may be automatically canceled due to product unavailability or delivery failure. ZEDX will not be liable for damages arising from order cancellation or delivery delay.
              </p>
            </>
          ),
        },
        {
          title: "User rights",
          body: (
            <>
              <p>
                ZEDX values its customers and is committed to supporting a smooth shopping experience. As a user of the website, you have the following rights:
              </p>
              <ul>
                <li>Right to access the website to browse, explore, and purchase products securely.</li>
                <li>Right to information about products, pricing, warranties, and policies.</li>
                <li>Right to privacy in line with the ZEDX Privacy Policy.</li>
                <li>Right to customer support for orders, returns, warranties, and related concerns.</li>
                <li>Right to fair exchanges and returns in accordance with the ZEDX Return Policy.</li>
                <li>Right to product authenticity, with products sold as authentic, brand-new products crafted by ZEDX in-house manufacturers.</li>
              </ul>
            </>
          ),
        },
        {
          title: "User responsibilities",
          body: (
            <>
              <p>To maintain a safe and fair shopping experience for all users, you must:</p>
              <ul>
                <li>Provide accurate purchase, shipping, and contact information.</li>
                <li>Use the website responsibly and not attempt unauthorized access.</li>
                <li>Respect ZEDX intellectual property, including content, images, and trademarks.</li>
                <li>Follow the stated procedures for replacements, exchange requests, and warranty claims.</li>
                <li>Communicate respectfully with the customer support team and avoid abusive or inappropriate behavior.</li>
                <li>Comply with UAE laws and regulations when using the platform.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Exchanges, returns, warranty, and refunds",
          body: (
            <>
              <p>
                ZEDX has a strict exchange and return policy. Refunds are not offered once a product has been delivered. In the case of a defective product, a replacement or service may be provided after verification.
              </p>
              <p>
                Exchange solutions are provided for verified manufacturing defects only. Physical damages are not covered. Manufacturer warranty is provided for one year, subject to the applicable warranty terms and procedures.
              </p>
              <p>
                Customers must refer to the full Return Policy and applicable manufacturer warranty terms for specific coverage, claim procedures, and exclusions.
              </p>
            </>
          ),
        },
        {
          title: "Disclaimers and limitation of liability",
          body: (
            <>
              <p>
                ZEDX strives to provide accurate and up-to-date information on its website, but does not guarantee that all product descriptions, images, pricing, or specifications are error-free. ZEDX reserves the right to correct errors and update information without prior notice.
              </p>
              <p>
                Product availability is subject to change without notice. Certain products may go out of stock or be discontinued, and ZEDX is not liable for inconvenience caused by product unavailability.
              </p>
              <p>
                All products sold by ZEDX are covered under applicable manufacturer warranties. ZEDX is not responsible for direct, indirect, incidental, or consequential damages arising from product use, physical damage, or defects, except as required by applicable law.
              </p>
              <p>
                ZEDX shall not be held liable for any loss, damage, or disruption caused by technical failures, server downtime, cyberattacks, or unforeseen circumstances beyond its control.
              </p>
            </>
          ),
        },
        {
          title: "Third-party links, changes, and governing law",
          body: (
            <>
              <p>
                The website may contain links to third-party websites for additional information. ZEDX does not endorse, control, or take responsibility for the content, security, or policies of external websites. Users should exercise caution when accessing third-party links.
              </p>
              <p>
                ZEDX reserves the right to modify, update, or amend these Terms and related disclaimers at any time without prior notice. Continued use of the website implies acceptance of the revised Terms.
              </p>
              <p>
                These Terms, disclaimers, and related policies are governed by and interpreted under the laws of the United Arab Emirates.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
