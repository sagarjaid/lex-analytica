import Link from "next/link";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `GDPR Compliance | ${config.appName} - Data Protection Rights & Privacy`,
  description:
    "ZeroTheorem's GDPR compliance information outlines your data protection rights under EU regulations. Learn about our commitment to data privacy and your rights as a data subject.",
  keywords: [
    "GDPR compliance",
    "data protection rights",
    "EU privacy regulations",
    "zerotheorem GDPR",
    "data subject rights",
    "privacy rights",
    "GDPR compliance",
    "data protection",
    "EU data privacy",
    "data subject access",
  ],
  canonicalUrlRelative: "/gdpr",
  openGraph: {
    title: `GDPR Compliance | ${config.appName} - Data Protection Rights & Privacy`,
    description:
      "ZeroTheorem's GDPR compliance information outlines your data protection rights under EU regulations.",
    url: "https://zerotheorem.com/gdpr",
  },
  extraTags: {
    "article:author": "ZeroTheorem Legal Team",
    "article:section": "Legal",
    "article:tag": ["GDPR", "Data Protection", "Privacy Rights", "Legal"],
  },
});

const PrivacyPolicy = () => {
  return (
    <>
      {renderSchemaTags("gdpr")}
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
            </svg>{" "}
            Back
          </Link>
          <h1 className="text-3xl font-extrabold py-6">
            General Data Protection Regulation (GDPR) for {config.appName}
          </h1>

          <pre
            className="leading-relaxed whitespace-pre-wrap"
            style={{ fontFamily: "sans-serif" }}
          >
            {`Updated on 1 April, 2024

At Zerotheorem, accessible from https://zerotheorem.com/, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Zerotheorem and how we use it.

General Data Protection Regulation (GDPR)

We are a Data Controller of your information.

Zerotheorem legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Information we collect and the specific context in which we collect the information:
• Zerotheorem needs to perform a contract with you
• You have given Zerotheorem permission to do so
• Processing your personal information is in Zerotheorem legitimate interests
• Zerotheorem needs to comply with the law

Zerotheorem will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.

If you are a resident of the European Economic Area (EEA), you have certain data protection rights. If you wish to be informed what Personal Information we hold about you and if you want it to be removed from our systems, please contact us.

In certain circumstances, you have the following data protection rights:
• The right to access, update or to delete the information we have on you.
• The right of rectification.
• The right to object.
• The right of restriction.
• The right to data portability
• The right to withdraw consent

Cookies and Web Beacons

Like any other website, Zerotheorem uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.

Google DoubleClick DART Cookie

Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – https://policies.google.com/technologies/ads

Our Advertising Partners

Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies below.

• Google
  https://policies.google.com/technologies/ads

Privacy Policies

You may consult this list to find the Privacy Policy for each of the advertising partners of Zerotheorem.

Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Zerotheorem, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.

Note that Zerotheorem has no access to or control over these cookies that are used by third-party advertisers.

Third Party Privacy Policies

Zerotheorem's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.

You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.

Children's Information

Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.

Zerotheorem does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.

Online Privacy Policy Only

Our Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Zerotheorem. This policy is not applicable to any information collected offline or via channels other than this website.

Consent

By using our website, you hereby consent to our Privacy Policy and agree to its terms.`}
          </pre>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicy;
