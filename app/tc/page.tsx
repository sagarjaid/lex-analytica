import Link from "next/link";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName} - Investment Firm Legal Terms`,
  description:
    "ZeroTheorem's terms and conditions outline the legal framework for using our investment services. Review our terms for Bitcoin tail risk investment and corporate services.",
  keywords: [
    "terms and conditions",
    "investment firm terms",
    "zerotheorem terms",
    "legal terms",
    "investment services terms",
    "bitcoin investment terms",
    "corporate services terms",
    "legal framework",
    "terms of service",
    "investment agreement",
  ],
  canonicalUrlRelative: "/tc",
  openGraph: {
    title: `Terms and Conditions | ${config.appName} - Investment Firm Legal Terms`,
    description:
      "ZeroTheorem's terms and conditions outline the legal framework for our Bitcoin tail risk investment and corporate services.",
    url: "https://zerotheorem.com/tc",
  },
  extraTags: {
    "article:author": "ZeroTheorem Legal Team",
    "article:section": "Legal",
    "article:tag": ["Terms and Conditions", "Legal", "Investment Terms"],
  },
});

const TOS = () => {
  return (
    <>
      {renderSchemaTags("terms")}
      <main className="max-w-xl mx-auto">
        <div className="p-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--accent))] rounded transition-colors duration-200 border border-[hsl(var(--border))] px-2 py-1 w-fit pr-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </Link>
          <h1 className="text-3xl font-extrabold py-6">
            Terms and Conditions for {config.appName}
          </h1>

          <pre
            className="leading-relaxed whitespace-pre-wrap"
            style={{ fontFamily: "sans-serif" }}
          >
            {`Updated on 1 April, 2024

Welcome to Zerotheorem! These terms and conditions outline the rules and regulations for the use of Zerotheorem's Website, located at https://zerotheorem.com/

By accessing this website we assume you accept these terms and conditions. Do not continue to use Zerotheorem if you do not agree to take all of the terms and conditions stated on this page.

The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services, in accordance with and subject to, prevailing law of in. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.

Cookies

We employ the use of cookies. By accessing Zerotheorem, you agreed to use cookies in agreement with the Zerotheorem's Privacy Policy.

Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.

License

Unless otherwise stated, Zerotheorem and/or its licensors own the intellectual property rights for all material on Zerotheorem. All intellectual property rights are reserved. You may access this from Zerotheorem for your own personal use subjected to restrictions set in these terms and conditions.

You must not:
• Republish material from Zerotheorem
• Sell, rent or sub-license material from Zerotheorem
• Reproduce, duplicate or copy material from Zerotheorem
• Redistribute content from Zerotheorem

This Agreement shall begin on the date hereof.

Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Zerotheorem does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Zerotheorem,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, Zerotheorem shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.

You warrant and represent that:
• You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;
• The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;
• The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy
• The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.

You hereby grant Zerotheorem a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.

Hyperlinking to our Content

The following organizations may link to our Website without prior written approval:
• Government agencies;
• Search engines;
• News organizations;
• Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and
• System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.

These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.

We may consider and approve other link requests from the following types of organizations:
• commonly-known consumer and/or business information sources;
• dot.com community sites;
• associations or other groups representing charities;
• online directory distributors;
• internet portals;
• accounting, law and consulting firms; and
• educational institutions and trade associations.

We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of Zerotheorem; and (d) the link is in the context of general resource information.

These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site.

If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to Zerotheorem. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.

Approved organizations may hyperlink to our Website as follows:
• By use of our corporate name; or
• By use of the uniform resource locator being linked to; or
• By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party's site.

No use of Zerotheorem's logo or other artwork will be allowed for linking absent a trademark license agreement.

iFrames

Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.

Content Liability

We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.

Reservation of Rights

We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.

Removal of links from our website

If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.

We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.

Disclaimer

To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
• limit or exclude our or your liability for death or personal injury;
• limit or exclude our or your liability for fraud or fraudulent misrepresentation;
• limit any of our or your liabilities in any way that is not permitted under applicable law; or
• exclude any of our or your liabilities that may not be excluded under applicable law.

The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.

As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.`}
          </pre>
        </div>
      </main>
    </>
  );
};

export default TOS;
